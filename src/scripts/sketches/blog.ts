import {
  DIVIDER,
  INK,
  MONO,
  PENCIL,
  type ColorPair,
  arrow,
  ellipse,
  labelChip,
  line,
  palette,
  prepareCanvas,
  rect,
  seedFromText,
  text,
} from './core';

const coverFrame = (
  canvas: HTMLCanvasElement,
  label: string,
  accent: ColorPair
) => {
  const env = prepareCanvas(canvas, 320, 180);
  if (!env) return null;

  text(env, label, 28, 30, 19, PENCIL);
  ellipse(env, {
    cx: 284,
    cy: 28,
    width: 28,
    height: 28,
    fill: accent.bg,
    stroke: accent.border,
    strokeWidth: 2,
    roughness: 1,
    seed: env.seed + 4,
  });
  return { env, accent };
};

const drawSkillCover = (canvas: HTMLCanvasElement) => {
  const base = coverFrame(canvas, 'skill stack', palette.minimum);
  if (!base) return;
  const { env } = base;

  rect(env, {
    x: 38,
    y: 62,
    width: 96,
    height: 70,
    fill: palette.empty.bg,
    stroke: INK,
    strokeWidth: 2,
    roughness: 1.1,
    radius: 9,
    seed: env.seed + 10,
  });
  rect(env, {
    x: 48,
    y: 52,
    width: 58,
    height: 18,
    fill: palette.empty.bg,
    stroke: INK,
    strokeWidth: 1.6,
    roughness: 1,
    radius: 7,
    seed: env.seed + 11,
  });
  text(env, 'SKILL.md', 54, 98, 15, INK, 'left', 700, MONO);
  labelChip(env, 172, 60, 'trigger', palette.comparing, env.seed + 20);
  labelChip(env, 172, 108, 'playbook', palette.matched, env.seed + 21);
  arrow(env, 138, 96, 168, 82, env.seed + 22, PENCIL);
  arrow(env, 218, 94, 218, 106, env.seed + 23, PENCIL);
  text(env, 'instructions as reusable moves', 160, 164, 18, PENCIL, 'center');
};

const drawClaudeCover = (canvas: HTMLCanvasElement) => {
  const base = coverFrame(canvas, 'claude code', palette.idle);
  if (!base) return;
  const { env } = base;

  rect(env, {
    x: 36,
    y: 62,
    width: 128,
    height: 78,
    fill: '#2f2a25',
    stroke: INK,
    strokeWidth: 2,
    roughness: 1.05,
    radius: 10,
    seed: env.seed + 10,
  });
  text(env, '$ plan', 54, 92, 15, '#fffdf7', 'left', 700, MONO);
  text(env, '$ test', 54, 120, 15, '#fffdf7', 'left', 700, MONO);
  rect(env, {
    x: 202,
    y: 58,
    width: 72,
    height: 84,
    fill: palette.empty.bg,
    stroke: PENCIL,
    strokeWidth: 1.8,
    roughness: 1.1,
    radius: 8,
    seed: env.seed + 20,
  });
  text(env, 'CLAUDE', 214, 84, 13, INK, 'left', 700, MONO);
  line(env, 214, 104, 258, 102, env.seed + 21, palette.idle.border, 2, 1);
  line(env, 214, 124, 246, 122, env.seed + 22, palette.matched.border, 2, 1);
  arrow(env, 166, 102, 200, 102, env.seed + 23, PENCIL);
  text(env, 'plan, verify, commit', 160, 164, 18, PENCIL, 'center');
};

const drawOciCover = (canvas: HTMLCanvasElement) => {
  const base = coverFrame(canvas, 'oci survival', palette.error);
  if (!base) return;
  const { env } = base;

  rect(env, {
    x: 38,
    y: 68,
    width: 90,
    height: 58,
    fill: palette.empty.bg,
    stroke: INK,
    strokeWidth: 2,
    roughness: 1.1,
    radius: 10,
    seed: env.seed + 10,
  });
  text(env, 'VM', 74, 105, 24, INK, 'center', 700);
  rect(env, {
    x: 184,
    y: 78,
    width: 82,
    height: 38,
    fill: palette.comparing.bg,
    stroke: palette.comparing.border,
    strokeWidth: 2,
    roughness: 1.1,
    radius: 12,
    seed: env.seed + 11,
  });
  text(env, 'boot', 225, 103, 17, INK, 'center', 700);
  arrow(env, 132, 96, 180, 96, env.seed + 12, PENCIL);
  line(env, 58, 142, 270, 138, env.seed + 13, palette.matched.border, 2.4, 1.4);
  text(
    env,
    'replace, do not terminate',
    160,
    164,
    15,
    palette.error.border,
    'center',
    700
  );
};

const drawGoogleCover = (canvas: HTMLCanvasElement) => {
  const base = coverFrame(canvas, 'google region', palette.cached);
  if (!base) return;
  const { env } = base;

  ['pay', 'play', 'legal'].forEach((label, index) => {
    const y = 66 + index * 30;
    rect(env, {
      x: 44,
      y,
      width: 104,
      height: 24,
      fill: index === 0 ? palette.idle.bg : 'transparent',
      stroke: index === 1 ? palette.comparing.border : PENCIL,
      strokeWidth: 1.8,
      roughness: 1,
      radius: 8,
      seed: env.seed + index + 10,
    });
    text(env, label, 64, y + 17, 14, INK, 'left', 700, MONO);
  });
  arrow(env, 154, 104, 204, 104, env.seed + 20, PENCIL);
  ellipse(env, {
    cx: 242,
    cy: 104,
    width: 62,
    height: 62,
    fill: palette.cached.bg,
    stroke: palette.cached.border,
    strokeWidth: 2.4,
    roughness: 1.1,
    seed: env.seed + 21,
  });
  text(env, 'US', 242, 112, 24, INK, 'center', 700);
  line(env, 222, 136, 266, 132, env.seed + 22, palette.cached.border, 2, 1);
  text(env, 'three layers, one region', 160, 164, 18, PENCIL, 'center');
};

const drawGenericCover = (canvas: HTMLCanvasElement) => {
  const slug = canvas.dataset.slug || 'note';
  const accent = [
    palette.idle,
    palette.comparing,
    palette.matched,
    palette.minimum,
  ][seedFromText(slug) % 4] as ColorPair;
  const base = coverFrame(canvas, 'field note', accent);
  if (!base) return;
  const { env } = base;

  line(env, 48, 74, 188, 68, env.seed + 1, accent.border, 2.4, 1.1);
  line(env, 48, 100, 274, 94, env.seed + 2, PENCIL, 2, 1.1);
  line(env, 48, 124, 230, 120, env.seed + 3, PENCIL, 2, 1.1);
  text(env, String(seedFromText(slug) % 99), 284, 35, 14, INK, 'center', 700);
};

const coverBySlug: Record<string, (canvas: HTMLCanvasElement) => void> = {
  'agent-skills': drawSkillCover,
  'claude-code-best-practices': drawClaudeCover,
  'oci-free-tier-reinstall': drawOciCover,
  'google-account-migrate-to-us': drawGoogleCover,
};

export const drawBlogSketch = (canvas: HTMLCanvasElement) => {
  const draw = coverBySlug[canvas.dataset.slug || ''] || drawGenericCover;
  draw(canvas);
};

export const drawDivider = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 900, 40);
  if (!env) return;
  const roughness = Number(canvas.dataset.roughness || 2.4);
  const bowing = Number(canvas.dataset.bowing || 4);
  line(env, 120, 22, 780, 22, env.seed || 6600, DIVIDER, 2, roughness, bowing);
};

export const drawFrame = (canvas: HTMLCanvasElement) => {
  const parent = canvas.parentElement;
  if (!parent) return;

  const bounds = parent.getBoundingClientRect();
  const env = prepareCanvas(
    canvas,
    Math.round(bounds.width),
    Math.round(bounds.height)
  );
  if (!env) return;

  rect(env, {
    x: 4,
    y: 4,
    width: Math.max(1, env.width - 8),
    height: Math.max(1, env.height - 8),
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 1.7,
    roughness: 1.2,
    seed: env.seed,
  });
};
