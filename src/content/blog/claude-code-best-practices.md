---
title: Claude Code Best Practices
description: Practical tips and workflows for working effectively with Claude Code — from CLAUDE.md setup and Plan Mode to context management, TDD, and Git workflows.
date: 2026-04-08
---

Claude Code is more than an autocomplete tool — it's an autonomous agent that can read your codebase, run commands, edit files, write tests, and open pull requests. But treating it like a smarter Copilot will leave most of its capability on the table.

Getting the most out of it means learning to work _with_ it: onboarding it properly, giving it clear direction, and building feedback loops so it can verify its own work.

## 1. Set Up `CLAUDE.md` — The Permanent Brain

The single highest-impact thing you can do is create and maintain a `CLAUDE.md` file at your project root. Claude loads it automatically at the start of every session, making it the equivalent of a permanent onboarding document.

Run `/init` inside a project to generate a starter file, then refine it manually.

**What to include:**

```markdown
# CLAUDE.md

## Stack

- Astro 5 + Tailwind CSS v4
- TypeScript strict mode
- Named exports only (no default exports)

## Conventions

- Components live in src/components/<feature>/
- Use Lucide icons from @lucide/astro
- Date format: YYYY-MM-DD

## Do NOT

- Change existing API contracts without explicit approval
- Install new dependencies without asking first
- Use class-based React components
```

**Key rules for a good `CLAUDE.md`:**

- **Target under 200 lines.** A bloated file trains Claude to skim — or ignore — it.
- **Be explicit about "No-Nos".** Constraints are as important as conventions.
- **Use strong language for critical rules:** `YOU MUST`, `NEVER`, `ALWAYS`. Claude respects emphasis.
- **Use `@other-file.md` imports** to reference longer reference material without bloating the main file.

For monorepos, you can have a global `CLAUDE.md` at the root and additional ones in each package directory. For path-specific rules in larger repos, use `.claude/rules/` instead of cramming everything into a single file.

**Auto Memory** (updated via `/memory`) is worth understanding separately. Unlike session context, auto memory is **cross-session persistent** — stored locally in `~/.claude/projects/...` and loaded back on every future session in the same project. This is what lets Claude avoid making the same mistake twice in long-running work.

**Auto Mode** is not a blanket bypass. It runs a local classifier that dynamically evaluates the safety and reversibility of each action — file deletions, for example, still require human confirmation. Understanding this makes it safe to use without disabling your judgment.

## 2. Plan Before You Code

For anything beyond a trivial change, don't let Claude jump straight into writing code. Force it to think first.

**Use Plan Mode** — press `Shift+Tab` to cycle through permission modes (Normal → Auto-Accept → Plan). From the command line, you can go directly: `claude --permission-mode plan`. In Plan Mode, Claude can read files and run exploratory shell commands (like `grep`, `find`, `cat`) to understand the codebase — it just cannot modify source files.

The workflow looks like this:

1. **Explore** (Plan Mode): _"Read `src/auth/` and understand how sessions work."_
2. **Plan**: _"I want to add Google OAuth. List the files that need to change and outline a step-by-step implementation plan."_
3. **Review the plan** — push back on assumptions, correct direction before any code is written. Press `Ctrl+G` to edit the plan in your external editor.
4. **Implement** (Normal Mode): _"Execute the plan. Write tests first, then the implementation."_
5. **Commit**: _"Commit with a descriptive message and open a PR."_

This mirrors a proper code review cycle: small, reviewable steps rather than one massive unreviewed diff.

## 3. Give Claude a Way to Verify Its Own Work

Claude performs dramatically better when it has a concrete verification mechanism. Without one, it will confidently write code that looks correct but fails at runtime.

**Test-Driven Development (TDD)** is the most reliable approach:

> "Write the tests for `validateEmail` first — cover these cases: [list them]. Run the suite and confirm they fail. Then implement the function until all tests pass."

For UI work, paste in a design screenshot and ask Claude to compare its output against it. The visual diff forces it to check alignment, spacing, and layout precisely.

**A better prompt pattern:**

- ❌ _"Implement email validation"_
- ✅ _"Write `validateEmail`. Include tests for: valid address, missing @, empty string. Run the tests after implementing and fix any failures. Explain the root cause of any bug you find."_

The difference is whether Claude has a success criterion it can check — not just one it claims to have met.

## 4. Manage the Context Window Deliberately

As a session grows, Claude accumulates file reads, command output, and conversation history. A bloated context degrades reasoning, increases cost, and causes Claude to "forget" earlier instructions.

Two tools help:

- **`/clear`** — wipes the context entirely. Use this between unrelated tasks. Think of it as punctuation: once a bug is fixed, clear before starting the next feature.
- **`/compact`** — asks Claude to summarize essential decisions while freeing up token space. The key upgrade: **`/compact` accepts arguments**. Instead of blind compression, direct it: `/compact Keep the auth logic context, drop the CSS exploration`. This gives you precise control over what survives.

Other habits that help:

- Reference files with `@filename` instead of pasting their contents into the chat.
- Let Claude `grep` and `read` what it needs rather than dumping everything upfront.
- For large projects, break work into sub-tasks with separate sessions.

## 5. Be Specific, Not Verbose

Claude performs best with a clear, targeted goal — not a wall of vague context.

**Less effective:**

> "My app is slow sometimes, maybe check the rendering?"

**More effective:**

> "The `<ProjectList>` component re-renders on every keystroke. Fix it so it only re-renders when the filtered results actually change."

Specificity removes ambiguity and lets Claude work immediately instead of asking clarifying questions. Point it at the file, not a description of the file.

## 6. Rewind, Correct, Don't Restart

When Claude produces something wrong, correct it in-place rather than abandoning the conversation.

**For surgical rollbacks, use `Esc Esc`** to open the Checkpoint menu. This is where Claude Code gets genuinely powerful — two distinct options let you handle the two most common failure modes:

- **Restore code only**: Claude's reasoning was right, but the implementation broke. Undo the code changes, keep the correct reasoning in the conversation, then ask it to try a different approach.
- **Restore conversation only**: The code landed correctly, but Claude has started hallucinating or drifting in the conversation. Wipe the polluted context, keep the good code.

The combination of targeted rewinds and mid-session corrections means you almost never need to start over from scratch. Use `/clear` only when the session context itself has become fundamentally misleading.

## 7. Use Safe Git Workflows

Because Claude is an active agent, protecting your main branch matters.

- **Always work on a branch.** Ask Claude to create one before starting any feature or fix. This gives you a clean rollback point if things go sideways.
- **Commit early and often.** Ask Claude to commit after each successful step or passing test suite. Incremental commits make `git checkout` trivial if a later edit breaks things.
- **Parallel work with Git worktrees.** If you need Claude to handle two independent tasks simultaneously, use `git worktree`. This creates isolated directories sharing the same repo history, letting multiple Claude instances run in parallel without overwriting each other's changes.
- **Install `gh`.** If you want Claude to reliably open PRs, comment on issues, and handle review workflows, authenticate the GitHub CLI. It's the tooling path Claude Code is optimized for.

## 8. Automate Repetitive Tasks with Hooks

> **`CLAUDE.md` is probabilistic. Hooks are deterministic.**

The instructions in `CLAUDE.md` are suggestions to an LLM — they may be followed less reliably as context fills up. Hooks and permission blocklists in `settings.json` are enforced unconditionally. Put code style guidance in Markdown, but put your safety guardrails in Hooks.

Hooks execute shell commands at lifecycle events with no dependency on AI memory. Context data is passed via **stdin as JSON** — use `jq` to extract what you need:

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

The `matcher` field accepts a regex matched against the tool name. Context (including the file path) arrives on stdin as JSON — parse it with `jq` rather than relying on template interpolation, which is not supported.

Common uses: auto-format on every file write, block edits to migration files, run lint on save.

## 9. Connect Claude to the World with MCP

Skills and Hooks extend what Claude does within your local environment. **MCP (Model Context Protocol)** is how you connect Claude to external systems entirely.

```bash
claude mcp add github     # GitHub issues, PRs, repos
claude mcp add postgres   # Live database schema and queries
claude mcp add figma      # Design tokens and component specs
```

With MCP connections active, Claude can read a real bug ticket from Jira, inspect the actual database table it needs to write against, and check the current Figma spec — all within the same session. This is what makes the agent genuinely context-aware rather than working from stale, described context.

## 10. Non-Interactive Automation and Piping

Claude Code works headlessly, making it a first-class citizen in CI pipelines, pre-commit hooks, and shell scripts.

```bash
# Feed errors directly to Claude for diagnosis
tail -n 200 app.log | claude -p "Explain why the build failed and provide the fix"

# Summarize a diff with structured output
git diff HEAD~1 | claude -p "Review this for security issues" --output-format json

# Use in CI
claude -p "check staged files for console.log statements" --output-format json
```

The `--output-format json` and `stream-json` flags make it easy to parse Claude's responses in automated workflows. `claude -p` runs a single task headlessly and exits — no session management overhead required.

## 11. Use Claude for Code Review

Claude isn't just for writing code — it's an effective reviewer. For best results, open a fresh session with only the diff in context, rather than asking the same session that wrote the code to review it.

> "Review this auth handler for edge cases — specifically around unauthenticated requests and token expiry."
> "Are there any accessibility issues in this form?"
> "Does this regex cover Unicode input, or does it break?"

This kind of review catches things that are easy to miss under time pressure.

## 12. Verify Security-Sensitive Output Yourself

Claude is capable, but not infallible. For any output that involves:

- Auth and permissions logic
- Database queries
- Third-party API calls
- Regex patterns on user input

...read the output yourself and run the tests. Treat Claude like a capable developer whose PRs you still review before merging — because that's exactly what it is.

## The Mental Model

The developers who get the most out of Claude Code aren't the ones who hand off the most work. They're the ones who stay engaged: they set direction in Plan Mode, verify output with tests, manage context deliberately, and correct course quickly when Claude drifts.

At its best, a Claude Code session feels like genuine pair programming — you handle the judgment calls, Claude handles the execution, and the two of you ship faster than either could alone.
