---
title: Understanding Agent Skills
description: What skills actually are in Claude Code, how they differ from tools and subagents, and how to design reusable workflows that trigger reliably.
date: 2025-11-21
---

The word "skill" gets overloaded in AI conversations. Sometimes it means a tool, sometimes it means a plugin, and sometimes it just means "something the model can do."

In Claude Code, a **skill** is more specific than that. It is not the same thing as a shell command, a browser integration, or an MCP server. A skill is a reusable set of instructions that Claude can load when it is relevant, or that you can invoke directly with `/skill-name`.

That distinction matters. If you understand what a skill is, you can stop repeating the same instructions in chat and start packaging high-value workflows into something Claude can use consistently.

## What a Skill Actually Is

In Claude Code, a skill is a directory with a `SKILL.md` entrypoint. That file contains:

- YAML frontmatter that tells Claude when and how to use the skill
- Markdown instructions that act as the playbook once the skill is invoked
- Optional supporting files such as templates, examples, scripts, and reference docs

The important shift is this:

- **Tools** are the raw capabilities: read files, run Bash, edit code, browse the web.
- **Skills** are the reusable instructions for how to use those capabilities well.

A skill does not replace Claude's tools. It teaches Claude how to orchestrate them for a specific workflow.

## Skills vs. Tools vs. CLAUDE.md vs. Subagents

This is where most explanations get fuzzy, so it is worth being precise.

| Mechanism        | What it is                                                          | Best used for                                                        |
| ---------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Tools            | Raw actions Claude can take                                         | Reading files, running commands, editing code, calling MCP tools     |
| Skills           | Reusable on-demand playbooks                                        | Repeatable workflows like PR review, deploys, deep research          |
| `CLAUDE.md`      | Persistent instructions loaded every session                        | Project conventions, build commands, architecture rules              |
| `.claude/rules/` | Scoped persistent instructions                                      | Path-specific rules in larger repos                                  |
| Subagents        | Separate execution contexts with their own prompt, tools, and model | Parallel work, isolated review, specialized research                 |
| MCP              | A protocol for exposing tools, resources, and prompts               | Connecting Claude to GitHub, databases, Figma, Notion, internal APIs |

The clean mental model is:

- Put **always-on project guidance** in `CLAUDE.md`
- Put **path-specific rules** in `.claude/rules/`
- Put **repeatable workflows** in skills
- Use **subagents** when you need isolation, delegation, or a different model/tool budget
- Use **MCP** when you need Claude to access external systems

## What a Real Skill Looks Like

The current Claude Code format is a `SKILL.md` file, not an abstract schema with `inputs` and `outputs`.

Here is a realistic example:

```markdown
---
name: review-pr
description: Review a pull request for regressions, edge cases, and missing tests. Use when the user asks for a PR review or asks whether a change is safe.
argument-hint: '[pr-number]'
context: fork
agent: Explore
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(gh pr diff *)
  - Bash(gh pr view *)
---

Review PR $ARGUMENTS.

1. Read the diff and changed files.
2. Look for behavioral regressions, security issues, and missing tests.
3. Cite concrete file paths in every finding.
4. Prioritize findings by severity.
5. Do not suggest implementation changes unless explicitly asked.
```

A few things are happening here:

- `name` becomes the slash command, so this skill can be invoked with `/review-pr`
- `description` tells Claude when it should auto-load the skill
- `context: fork` runs the skill in an isolated subagent context
- `agent: Explore` routes it through a read-only exploration agent
- `allowed-tools` narrows which tools the skill can use without extra permission prompts

That is what makes a skill useful: it is a small, explicit operating procedure.

## Where Skills Live

Claude Code can load skills from several places:

- `~/.claude/skills/<skill-name>/SKILL.md` for personal skills
- `.claude/skills/<skill-name>/SKILL.md` for project skills
- plugin `skills/` directories for plugin-provided skills

Older `.claude/commands/` files still work, but custom commands have effectively been merged into skills. If you are creating something new, use the skills format.

For monorepos, project skills can also be discovered from nested `.claude/skills/` directories when Claude works inside those parts of the tree.

## When a Skill Is the Right Abstraction

Not everything should become a skill.

Use a skill when the workflow is:

- repeated often
- easy to describe as a step-by-step playbook
- too long or too specific to keep in `CLAUDE.md`
- something you want Claude to perform consistently across sessions

Good examples:

- PR review
- deployment checklists
- migration playbooks
- framework-specific code generation
- architecture review
- "explain this codebase using diagrams"

Bad examples:

- one-off project facts that belong in `CLAUDE.md`
- broad access to an external system, which is an MCP concern
- a complex specialist worker that really needs its own model, memory, and permission profile, which is usually a subagent

## The Most Important Frontmatter Fields

The markdown body matters, but the frontmatter decides whether the skill is discoverable and safe.

### `description`

This is the trigger surface. Claude uses it to decide when to load the skill automatically.

A weak description:

> Helps with code.

A strong description:

> Reviews pull requests for regressions, edge cases, and missing tests. Use when the user asks for a PR review, a risk check, or a second opinion on a diff.

Front-load the concrete use case. Long descriptions get truncated.

### `disable-model-invocation: true`

Use this for workflows that should never fire automatically, such as deploys, releases, production migrations, or destructive maintenance tasks.

That keeps the skill available as `/deploy` or `/release`, but stops Claude from deciding on its own that now is a good time to run it.

### `allowed-tools`

This lets you grant a skill only the tools it needs without opening the door wider than necessary.

For example:

```yaml
allowed-tools:
  - Read
  - Grep
  - Glob
```

That is far better than giving a review skill unrestricted Bash and edit access.

### `paths`

Use `paths` when a skill should only auto-activate around certain files or directories.

For example, a React performance skill might only matter under `src/components/**/*.tsx`, while an API validation skill might only matter under `src/api/**/*.ts`.

This reduces false triggers and keeps the active context cleaner.

### `context: fork` and `agent`

These fields are useful when the skill should run in isolation.

Use them when you want:

- a clean context window
- a read-only research pass
- lower-cost delegation
- less contamination from the main conversation

If the skill is just reference material like "our API conventions," do not fork it into a subagent. Forked skills need an actual task to execute.

## How to Write Skills That Trigger Reliably

Most bad skills fail in one of two ways: they never trigger, or they trigger constantly when they should not.

The fix is usually better scoping.

### 1. Keep the purpose narrow

Do not make a mega-skill called `engineering-assistant` that reviews code, writes commits, deploys services, and explains architecture.

Split those into separate skills with separate descriptions and tool access.

### 2. Describe when to use it, not just what it is

This is the biggest difference between a useful description and a decorative one.

Bad:

> Security helper for web apps.

Better:

> Reviews auth, permissions, input validation, and secret handling. Use when the user asks for a security review, asks whether a change is safe, or works on login, sessions, or access control.

### 3. Include negative guidance

If a skill is easy to misfire, say when not to use it.

For example:

> Do not use for style-only feedback or formatting changes.

That one line often improves trigger quality more than adding another paragraph of features.

### 4. Move large reference material into supporting files

A good skill is not necessarily a short skill, but the entrypoint should stay readable.

Keep `SKILL.md` focused, then add:

- templates for Claude to fill in
- example outputs
- reference docs
- small helper scripts

Claude can load those files when the skill needs them without turning the main instructions into a wall of text.

### 5. Prefer deterministic guardrails for risky workflows

If a workflow is safety-sensitive, do not rely on prompt wording alone.

Combine skills with:

- permission rules
- hooks
- narrow `allowed-tools`
- manual-only invocation

A deployment skill is much stronger when it is manual-only and backed by hooks than when it is just a paragraph saying "be careful."

## When a Subagent Is Better Than a Skill

Skills and subagents complement each other, but they are not interchangeable.

Choose a subagent when you need:

- a separate context window
- a different model
- persistent agent-specific memory
- a specific permission mode
- a specialized worker that should be delegated to automatically

Choose a skill when you need:

- reusable instructions
- a slash-command style workflow
- a lightweight playbook that can run in the current session
- something Claude can load on demand based on the task

One useful pattern is to combine them:

- keep the workflow in a skill
- set `context: fork`
- route it through `agent: Explore` or a custom subagent

That gives you reusable instructions and isolated execution at the same time.

## Common Mistakes

### Treating tools as skills

Reading files, editing code, browsing the web, and calling GitHub are tool capabilities. Skills are the instructions for how to use them.

### Putting everything in `CLAUDE.md`

If a workflow only matters occasionally, it should not consume startup context every session. Move it into a skill.

### Writing vague descriptions

Claude cannot reliably invoke a skill whose description is generic, abstract, or overloaded.

### Creating unsafe auto-trigger workflows

Do not let deploy, release, or migration skills auto-fire. Mark them manual-only.

### Building giant "do everything" skills

Large skills are harder to trigger correctly, harder to audit, and harder to maintain.

## Conclusion

Skills are not the raw capabilities of an agent. They are the reusable instructions that turn those capabilities into repeatable workflows.

That is why they matter. A good skill captures judgment that you do not want to restate every time: how to review a PR, how to deploy safely, how to explain code in your team's style, how to run a migration, how to research a subsystem without polluting the main session.

The practical progression in Claude Code is:

1. Put always-on guidance in `CLAUDE.md`
2. Move repeatable workflows into skills
3. Split isolated or specialized work into subagents
4. Add hooks and permissions where reliability matters

That is when Claude stops feeling like a chat interface and starts feeling like an actual working environment.
