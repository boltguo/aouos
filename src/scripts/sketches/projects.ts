import {
  INK,
  MONO,
  PENCIL,
  TRACK,
  arrow,
  ellipse,
  labelChip,
  line,
  node,
  palette,
  prepareCanvas,
  rect,
  text,
} from './core';

const drawLessonMap = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  rect(env, {
    x: 46,
    y: 44,
    width: 388,
    height: 162,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.15,
    radius: 16,
    seed: env.seed + 1,
  });
  text(env, 'lesson path', 70, 78, 24, PENCIL);
  ['array', 'tree', 'graph'].forEach((label, index) => {
    const x = 76 + index * 116;
    rect(env, {
      x,
      y: 112,
      width: 86,
      height: 44,
      fill: index === 1 ? palette.comparing.bg : 'transparent',
      stroke: index === 1 ? palette.comparing.border : INK,
      strokeWidth: 2,
      roughness: 1.1,
      radius: 12,
      seed: env.seed + 10 + index,
    });
    text(env, label, x + 43, 140, 19, INK, 'center', index === 1 ? 700 : 400);
    if (index < 2)
      arrow(env, x + 88, 134, x + 112, 134, env.seed + 20 + index, PENCIL);
  });
  line(env, 88, 184, 394, 178, env.seed + 30, TRACK, 2.4, 2.3, 4);
  text(env, 'visual notes, not slides', 240, 224, 22, PENCIL, 'center');
};

const drawDashboardSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  rect(env, {
    x: 52,
    y: 42,
    width: 376,
    height: 176,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.5,
    roughness: 1.15,
    radius: 14,
    seed: env.seed + 1,
  });
  line(env, 52, 82, 428, 82, env.seed + 2, INK, 2.1, 1);
  text(env, 'usage desk', 72, 69, 21, PENCIL);
  [0, 1, 2].forEach((index) => {
    const x = 82 + index * 92;
    const h = [54, 84, 38][index];
    rect(env, {
      x,
      y: 176 - h,
      width: 42,
      height: h,
      fill: [palette.idle.bg, palette.minimum.bg, palette.matched.bg][index],
      stroke: [
        palette.idle.border,
        palette.minimum.border,
        palette.matched.border,
      ][index],
      strokeWidth: 2.2,
      roughness: 1.05,
      radius: 9,
      seed: env.seed + 10 + index,
    });
  });
  ellipse(env, {
    cx: 346,
    cy: 140,
    width: 88,
    height: 88,
    fill: palette.comparing.bg,
    stroke: palette.comparing.border,
    strokeWidth: 2.4,
    roughness: 1.2,
    seed: env.seed + 20,
  });
  line(env, 346, 140, 382, 116, env.seed + 21, INK, 2.4, 0.8);
  text(env, 'budget', 346, 194, 18, PENCIL, 'center');
};

const drawTokenSystemSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  text(env, 'tokens', 62, 54, 25, PENCIL);
  const colors = [
    palette.idle,
    palette.matched,
    palette.comparing,
    palette.minimum,
  ];
  colors.forEach((color, index) => {
    const x = 70 + index * 78;
    rect(env, {
      x,
      y: 82,
      width: 54,
      height: 54,
      fill: color.bg,
      stroke: color.border,
      strokeWidth: 2.2,
      roughness: 1.1,
      radius: 11,
      seed: env.seed + index,
    });
  });
  [0, 1, 2].forEach((row) => {
    line(
      env,
      72,
      166 + row * 22,
      386 - row * 52,
      166 + row * 22,
      env.seed + 20 + row,
      PENCIL,
      2,
      1
    );
  });
  text(env, 'same decisions everywhere', 236, 236, 20, INK, 'center');
};

const drawLogoSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  rect(env, {
    x: 80,
    y: 54,
    width: 128,
    height: 128,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.2,
    radius: 24,
    seed: env.seed + 1,
  });
  ellipse(env, {
    cx: 136,
    cy: 104,
    width: 38,
    height: 38,
    fill: palette.idle.bg,
    stroke: palette.idle.border,
    strokeWidth: 2.2,
    seed: env.seed + 2,
  });
  ellipse(env, {
    cx: 164,
    cy: 144,
    width: 48,
    height: 48,
    fill: palette.minimum.bg,
    stroke: palette.minimum.border,
    strokeWidth: 2.2,
    seed: env.seed + 3,
  });
  line(env, 250, 84, 386, 76, env.seed + 10, PENCIL, 2.2, 1.3);
  line(env, 250, 122, 354, 118, env.seed + 11, PENCIL, 2.2, 1.3);
  line(env, 250, 160, 404, 152, env.seed + 12, PENCIL, 2.2, 1.3);
  text(env, 'brand kit', 248, 214, 22, INK);
};

const drawWatermarkSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  rect(env, {
    x: 58,
    y: 58,
    width: 142,
    height: 128,
    fill: palette.empty.bg,
    stroke: PENCIL,
    strokeWidth: 2,
    roughness: 1.1,
    radius: 12,
    seed: env.seed + 1,
  });
  rect(env, {
    x: 280,
    y: 58,
    width: 142,
    height: 128,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.1,
    radius: 12,
    seed: env.seed + 2,
  });
  text(env, 'mark', 96, 126, 26, palette.error.border, 'left', 700);
  line(env, 88, 138, 174, 94, env.seed + 3, palette.error.border, 5, 1.5);
  arrow(env, 214, 122, 270, 122, env.seed + 4, INK);
  line(env, 306, 126, 392, 100, env.seed + 5, palette.matched.border, 2.4, 1.2);
  text(env, 'clean', 318, 158, 22, palette.matched.border, 'left', 700);
};

const drawReactSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  node(env, 236, 62, 'App', palette.idle, env.seed + 1);
  node(env, 142, 142, 'UI', palette.cached, env.seed + 2);
  node(env, 236, 142, 'state', palette.comparing, env.seed + 3);
  node(env, 336, 142, 'fx', palette.minimum, env.seed + 4);
  arrow(env, 222, 82, 160, 122, env.seed + 10, PENCIL);
  arrow(env, 236, 88, 236, 118, env.seed + 11, PENCIL);
  arrow(env, 250, 82, 320, 122, env.seed + 12, PENCIL);
  rect(env, {
    x: 82,
    y: 198,
    width: 316,
    height: 34,
    fill: palette.matched.bg,
    stroke: palette.matched.border,
    strokeWidth: 2,
    roughness: 1,
    radius: 13,
    seed: env.seed + 20,
  });
  text(env, '30 lessons -> source reading', 240, 221, 19, INK, 'center', 700);
};

const drawVueSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  ellipse(env, {
    cx: 186,
    cy: 126,
    width: 136,
    height: 92,
    fill: 'transparent',
    stroke: palette.matched.border,
    strokeWidth: 2.4,
    roughness: 1.2,
    seed: env.seed + 1,
  });
  ellipse(env, {
    cx: 242,
    cy: 126,
    width: 136,
    height: 92,
    fill: 'transparent',
    stroke: palette.idle.border,
    strokeWidth: 2.4,
    roughness: 1.2,
    seed: env.seed + 2,
  });
  text(env, 'ref', 160, 134, 24, palette.matched.border, 'center', 700);
  text(env, 'view', 268, 134, 24, palette.idle.border, 'center', 700);
  labelChip(env, 90, 196, 'todo', palette.comparing, env.seed + 10);
  labelChip(env, 226, 196, 'shop', palette.minimum, env.seed + 11);
};

const drawGenericSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  rect(env, {
    x: 62,
    y: 54,
    width: 340,
    height: 146,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.15,
    radius: 16,
    seed: env.seed + 1,
  });
  [0, 1, 2].forEach((index) => {
    labelChip(
      env,
      92 + index * 96,
      104,
      ['idea', 'build', 'ship'][index],
      [palette.idle, palette.comparing, palette.matched][index],
      env.seed + 10 + index
    );
  });
  text(env, 'project note', 88, 226, 22, PENCIL);
};

const projectSketches: Record<string, (canvas: HTMLCanvasElement) => void> = {
  '01': drawLessonMap,
  '02': drawDashboardSketch,
  '03': drawTokenSystemSketch,
  '04': drawLogoSketch,
  '05': drawWatermarkSketch,
  '06': drawReactSketch,
  '07': drawVueSketch,
};

export const drawProjectSketch = (canvas: HTMLCanvasElement) => {
  const draw =
    projectSketches[canvas.dataset.project || ''] || drawGenericSketch;
  draw(canvas);
};
