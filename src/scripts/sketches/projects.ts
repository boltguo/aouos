import {
  INK,
  PENCIL,
  TRACK,
  type DrawEnv,
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

const DEG = Math.PI / 180;

type ShapeOptions = {
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  seed?: number;
  fill?: string;
  fillStyle?: 'solid' | 'hachure' | 'cross-hatch' | 'zigzag' | 'dots';
};

const polygon = (
  env: DrawEnv,
  points: [number, number][],
  opts: ShapeOptions = {}
) => {
  env.rc.polygon(points, {
    roughness: 1.1,
    strokeWidth: 2.2,
    seed: env.seed,
    fill: 'transparent',
    ...opts,
  });
};

const rotatedEllipse = (
  env: DrawEnv,
  cx: number,
  cy: number,
  width: number,
  height: number,
  angleDeg: number,
  opts: ShapeOptions = {}
) => {
  env.ctx.save();
  env.ctx.translate(cx, cy);
  env.ctx.rotate(angleDeg * DEG);
  env.rc.ellipse(0, 0, width, height, {
    roughness: 1,
    strokeWidth: 2.2,
    seed: env.seed,
    fill: 'transparent',
    ...opts,
  });
  env.ctx.restore();
};

const arc = (
  env: DrawEnv,
  cx: number,
  cy: number,
  radius: number,
  startDeg: number,
  endDeg: number,
  opts: ShapeOptions = {}
) => {
  const sx = cx + radius * Math.cos(startDeg * DEG);
  const sy = cy + radius * Math.sin(startDeg * DEG);
  const ex = cx + radius * Math.cos(endDeg * DEG);
  const ey = cy + radius * Math.sin(endDeg * DEG);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  env.rc.path(`M ${sx} ${sy} A ${radius} ${radius} 0 ${large} 1 ${ex} ${ey}`, {
    roughness: 1,
    strokeWidth: 5,
    seed: env.seed,
    fill: 'transparent',
    ...opts,
  });
};

// 01 — VizLearn: sorting bars (algorithms) + mini tree (data structures)
const drawVizLearnSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  text(env, 'visualize', 54, 46, 23, PENCIL);

  const baseline = 192;
  const barX = [54, 92, 130, 168, 206];
  const barH = [58, 96, 124, 80, 104];
  const compare = [false, true, true, false, false];
  barX.forEach((x, index) => {
    const tone = compare[index] ? palette.comparing : palette.idle;
    rect(env, {
      x,
      y: baseline - barH[index],
      width: 28,
      height: barH[index],
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2.2,
      roughness: 1.05,
      radius: 7,
      seed: env.seed + index,
    });
  });
  line(env, 48, baseline, 240, baseline, env.seed + 9, INK, 2.2, 1);

  node(env, 350, 80, '7', palette.idle, env.seed + 20);
  node(env, 312, 152, '3', palette.matched, env.seed + 21);
  node(env, 392, 152, '9', palette.comparing, env.seed + 22);
  arrow(env, 336, 98, 318, 130, env.seed + 30, PENCIL);
  arrow(env, 364, 98, 386, 130, env.seed + 31, PENCIL);

  text(env, 'arrays · trees · graphs', 240, 236, 19, INK, 'center', 700);
};

// 02 — AouoAI: usage dashboard with a trend line and a budget gauge
const drawAouoAiSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  rect(env, {
    x: 46,
    y: 44,
    width: 392,
    height: 152,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.1,
    radius: 14,
    seed: env.seed + 1,
  });
  text(env, 'ai usage', 66, 72, 21, PENCIL);
  line(env, 60, 84, 424, 84, env.seed + 2, TRACK, 1.8, 1);

  const points: [number, number][] = [
    [72, 168],
    [110, 150],
    [148, 158],
    [186, 124],
    [224, 134],
    [262, 100],
    [298, 110],
  ];
  for (let i = 0; i < points.length - 1; i += 1) {
    line(
      env,
      points[i][0],
      points[i][1],
      points[i + 1][0],
      points[i + 1][1],
      env.seed + 10 + i,
      palette.idle.border,
      2.6,
      0.8
    );
  }
  points.forEach((p, index) => {
    ellipse(env, {
      cx: p[0],
      cy: p[1],
      width: 7,
      height: 7,
      fill: palette.idle.border,
      stroke: palette.idle.border,
      strokeWidth: 1,
      seed: env.seed + 40 + index,
    });
  });

  ellipse(env, {
    cx: 372,
    cy: 138,
    width: 64,
    height: 64,
    fill: 'transparent',
    stroke: TRACK,
    strokeWidth: 4,
    roughness: 1,
    seed: env.seed + 50,
  });
  arc(env, 372, 138, 32, -90, 155, {
    stroke: palette.comparing.border,
    strokeWidth: 5,
    seed: env.seed + 51,
  });
  text(env, '68%', 372, 144, 16, INK, 'center', 700);
  text(env, 'budget', 372, 182, 14, PENCIL, 'center');

  text(env, 'token spend · models · budget', 240, 234, 17, PENCIL, 'center');
};

// 03 — AOUI: design tokens — color swatches, spacing ruler, type sample
const drawAouiSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  text(env, 'design tokens', 54, 46, 23, PENCIL);

  const swatches = [
    palette.idle,
    palette.matched,
    palette.comparing,
    palette.minimum,
    palette.cached,
  ];
  swatches.forEach((tone, index) => {
    rect(env, {
      x: 56 + index * 54,
      y: 64,
      width: 42,
      height: 42,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2.2,
      roughness: 1.05,
      radius: 10,
      seed: env.seed + index,
    });
  });

  text(env, 'space', 56, 152, 15, PENCIL);
  line(env, 56, 168, 250, 168, env.seed + 20, INK, 2, 1);
  [0, 26, 66, 128, 194].forEach((dx, index) => {
    const x = 56 + dx;
    line(env, x, 162, x, 174, env.seed + 30 + index, PENCIL, 1.8, 0.6);
  });

  text(env, 'Aa', 362, 170, 46, INK, 'center', 700);
  text(env, 'type', 362, 196, 15, PENCIL, 'center');

  text(env, 'color · space · type', 240, 236, 19, INK, 'center', 700);
};

// 04 — AOUOS LOGO: framed mark + download into a tray + format chips
const drawLogoSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  rect(env, {
    x: 52,
    y: 54,
    width: 150,
    height: 140,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.15,
    radius: 16,
    seed: env.seed + 1,
  });
  ellipse(env, {
    cx: 112,
    cy: 106,
    width: 56,
    height: 56,
    fill: palette.idle.bg,
    stroke: palette.idle.border,
    strokeWidth: 2.4,
    seed: env.seed + 2,
  });
  ellipse(env, {
    cx: 148,
    cy: 134,
    width: 66,
    height: 66,
    fill: palette.minimum.bg,
    stroke: palette.minimum.border,
    strokeWidth: 2.4,
    seed: env.seed + 3,
  });
  text(env, 'logo', 127, 184, 16, PENCIL, 'center');

  text(env, 'download', 252, 66, 20, INK);
  arrow(env, 330, 84, 330, 140, env.seed + 10, INK);
  line(env, 296, 152, 396, 152, env.seed + 11, INK, 2.6, 0.8);
  line(env, 296, 152, 296, 142, env.seed + 12, INK, 2.6, 0.6);
  line(env, 396, 152, 396, 142, env.seed + 13, INK, 2.6, 0.6);
  labelChip(env, 256, 168, 'SVG', palette.comparing, env.seed + 20);
  labelChip(env, 344, 168, 'PNG', palette.matched, env.seed + 21);

  text(env, 'svg · png · multiple sizes', 240, 236, 18, PENCIL, 'center');
};

// 05 — Watermark Remover: before / after photo frames
const drawWatermarkSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  const scene = (ox: number, withMark: boolean, seed: number) => {
    ellipse(env, {
      cx: ox + 34,
      cy: 88,
      width: 26,
      height: 26,
      fill: palette.comparing.bg,
      stroke: palette.comparing.border,
      strokeWidth: 2,
      seed: seed + 1,
    });
    polygon(
      env,
      [
        [ox + 12, 162],
        [ox + 58, 100],
        [ox + 104, 162],
      ],
      {
        fill: palette.idle.bg,
        fillStyle: 'solid',
        stroke: palette.idle.border,
        strokeWidth: 2,
        seed: seed + 2,
      }
    );
    polygon(
      env,
      [
        [ox + 72, 162],
        [ox + 112, 118],
        [ox + 156, 162],
      ],
      {
        fill: palette.matched.bg,
        fillStyle: 'solid',
        stroke: palette.matched.border,
        strokeWidth: 2,
        seed: seed + 3,
      }
    );
    if (withMark) {
      text(env, 'MARK', ox + 38, 138, 22, palette.error.border, 'left', 700);
      line(
        env,
        ox + 20,
        150,
        ox + 150,
        104,
        seed + 4,
        palette.error.border,
        4,
        1.3
      );
    }
  };

  rect(env, {
    x: 46,
    y: 54,
    width: 168,
    height: 120,
    fill: palette.empty.bg,
    stroke: PENCIL,
    strokeWidth: 2,
    roughness: 1.05,
    radius: 10,
    seed: env.seed + 1,
  });
  scene(46, true, env.seed + 10);

  arrow(env, 226, 114, 262, 114, env.seed + 5, INK);

  rect(env, {
    x: 274,
    y: 54,
    width: 160,
    height: 120,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.05,
    radius: 10,
    seed: env.seed + 2,
  });
  scene(274, false, env.seed + 20);
  line(env, 396, 78, 404, 88, env.seed + 30, palette.matched.border, 3.4, 0.6);
  line(env, 404, 88, 422, 66, env.seed + 31, palette.matched.border, 3.4, 0.6);

  text(env, 'watermarks → clean art', 240, 206, 19, INK, 'center', 700);
};

// 06 — React 19 Learning: React atom + phase progress
const drawReactSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  const cx = 158;
  const cy = 118;
  [0, 60, 120].forEach((angle, index) => {
    rotatedEllipse(env, cx, cy, 168, 60, angle, {
      stroke: palette.idle.border,
      strokeWidth: 2.2,
      seed: env.seed + index,
    });
  });
  ellipse(env, {
    cx,
    cy,
    width: 20,
    height: 20,
    fill: palette.idle.bg,
    stroke: palette.idle.border,
    strokeWidth: 2.4,
    seed: env.seed + 9,
  });

  text(env, 'React 19', 268, 88, 22, INK, 'left', 700);
  [0, 1, 2, 3].forEach((index) => {
    const done = index < 2;
    rect(env, {
      x: 268 + index * 40,
      y: 112,
      width: 32,
      height: 18,
      fill: done ? palette.matched.bg : palette.empty.bg,
      stroke: done ? palette.matched.border : PENCIL,
      strokeWidth: 2,
      roughness: 1,
      radius: 6,
      seed: env.seed + 20 + index,
    });
  });
  text(env, '30 lessons', 268, 168, 18, PENCIL);

  text(env, 'core → source mastery', 240, 238, 18, INK, 'center', 700);
};

// 07 — Vue 3 Learning: Vue chevron logo + phases
const drawVueSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return;

  polygon(
    env,
    [
      [80, 74],
      [234, 74],
      [157, 178],
    ],
    {
      fill: palette.matched.bg,
      fillStyle: 'solid',
      stroke: palette.matched.border,
      strokeWidth: 2.6,
      seed: env.seed + 1,
    }
  );
  polygon(
    env,
    [
      [120, 74],
      [194, 74],
      [157, 128],
    ],
    {
      fill: '#2f2a25',
      fillStyle: 'solid',
      stroke: INK,
      strokeWidth: 2.4,
      seed: env.seed + 2,
    }
  );

  text(env, 'Vue 3', 270, 90, 22, palette.matched.border, 'left', 700);
  labelChip(env, 262, 116, 'todo', palette.comparing, env.seed + 10);
  labelChip(env, 350, 116, 'shop', palette.minimum, env.seed + 11);
  text(env, 'composition api', 270, 174, 17, PENCIL);

  text(env, '4 phases · full-stack', 240, 238, 18, INK, 'center', 700);
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
  '01': drawVizLearnSketch,
  '02': drawAouoAiSketch,
  '03': drawAouiSketch,
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
