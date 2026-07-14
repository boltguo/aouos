import {
  INK,
  PENCIL,
  TRACK,
  type DrawEnv,
  arrow,
  ellipse,
  line,
  node,
  palette,
  prepareCanvas,
  pushDrawable,
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
  pushDrawable(
    env,
    env.gen.polygon(points, {
      roughness: 1.1,
      strokeWidth: 2.2,
      seed: env.seed,
      fill: 'transparent',
      ...opts,
    })
  );
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
  pushDrawable(
    env,
    env.gen.ellipse(0, 0, width, height, {
      roughness: 1,
      strokeWidth: 2.2,
      seed: env.seed,
      fill: 'transparent',
      ...opts,
    })
  );
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
  pushDrawable(
    env,
    env.gen.path(
      `M ${sx} ${sy} A ${radius} ${radius} 0 ${large} 1 ${ex} ${ey}`,
      {
        roughness: 1,
        strokeWidth: 5,
        seed: env.seed,
        fill: 'transparent',
        ...opts,
      }
    )
  );
};

// 01 — VizLearn: sorting bars (algorithms) + mini tree (data structures)
const drawVizLearnSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

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
  return env;
};

// 02 — AouoAI: usage dashboard with a trend line and a budget gauge
const drawAouoAiSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

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
  return env;
};

// 05 — Watermark Remover: before / after photo frames
const drawWatermarkSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

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
  return env;
};

// 06 — React 19 Learning: React atom + phase progress
const drawReactSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

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
  return env;
};

// learn — "I don't take notes. I build them.": crossed-out notebook → running lesson app
const drawLearnSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

  rect(env, {
    x: 40,
    y: 50,
    width: 150,
    height: 156,
    fill: palette.empty.bg,
    stroke: PENCIL,
    strokeWidth: 2,
    roughness: 1.05,
    radius: 8,
    seed: env.seed + 1,
  });
  [
    [62, 86, 166],
    [62, 112, 152],
    [62, 138, 168],
    [62, 164, 144],
  ].forEach(([x1, y, x2], i) => {
    line(env, x1, y, x2, y, env.seed + 2 + i, PENCIL, 2.2, 1);
  });
  line(env, 54, 190, 178, 64, env.seed + 8, palette.error.border, 4, 1.3);
  line(env, 54, 64, 178, 190, env.seed + 9, palette.error.border, 4, 1.3);

  arrow(env, 208, 128, 250, 128, env.seed + 12, INK);

  rect(env, {
    x: 264,
    y: 44,
    width: 180,
    height: 168,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.05,
    radius: 10,
    seed: env.seed + 14,
  });
  line(env, 264, 76, 444, 76, env.seed + 15, INK, 2.2, 1);
  ellipse(env, {
    cx: 282,
    cy: 60,
    width: 8,
    height: 8,
    stroke: PENCIL,
    seed: env.seed + 16,
  });
  ellipse(env, {
    cx: 297,
    cy: 60,
    width: 8,
    height: 8,
    stroke: PENCIL,
    seed: env.seed + 17,
  });
  (
    [
      [286, 38, palette.idle],
      [312, 62, palette.matched],
      [338, 88, palette.comparing],
    ] as const
  ).forEach(([x, h, tone], i) => {
    rect(env, {
      x,
      y: 192 - h,
      width: 20,
      height: h,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2,
      roughness: 1,
      radius: 4,
      seed: env.seed + 20 + i,
    });
  });
  line(env, 404, 112, 386, 146, env.seed + 24, PENCIL, 2, 1);
  line(env, 404, 112, 422, 146, env.seed + 25, PENCIL, 2, 1);
  (
    [
      [404, 104, palette.minimum],
      [386, 154, palette.idle],
      [422, 154, palette.idle],
    ] as const
  ).forEach(([cx, cy, tone], i) => {
    ellipse(env, {
      cx,
      cy,
      width: 20,
      height: 20,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2,
      seed: env.seed + 26 + i,
    });
  });
  return env;
};

// ship — "Small tools that scratch real itches.": one annoyance → two tiny tools
const drawShipSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

  polygon(
    env,
    [
      [66, 180],
      [126, 70],
      [186, 180],
    ],
    {
      fill: palette.comparing.bg,
      fillStyle: 'solid',
      stroke: palette.comparing.border,
      strokeWidth: 2.4,
      seed: env.seed + 1,
    }
  );
  text(env, '!', 126, 162, 40, palette.comparing.border, 'center', 700);

  arrow(env, 210, 128, 252, 128, env.seed + 4, INK);

  rect(env, {
    x: 272,
    y: 42,
    width: 170,
    height: 84,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.05,
    radius: 8,
    seed: env.seed + 6,
  });
  (
    [
      [292, 26, palette.idle],
      [318, 44, palette.matched],
      [344, 58, palette.comparing],
    ] as const
  ).forEach(([x, h, tone], i) => {
    rect(env, {
      x,
      y: 112 - h,
      width: 18,
      height: h,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2,
      roughness: 1,
      radius: 4,
      seed: env.seed + 8 + i,
    });
  });

  rect(env, {
    x: 272,
    y: 136,
    width: 170,
    height: 84,
    fill: 'transparent',
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.05,
    radius: 8,
    seed: env.seed + 12,
  });
  ellipse(env, {
    cx: 300,
    cy: 162,
    width: 16,
    height: 16,
    fill: palette.comparing.bg,
    stroke: palette.comparing.border,
    strokeWidth: 2,
    seed: env.seed + 13,
  });
  polygon(
    env,
    [
      [286, 204],
      [316, 166],
      [346, 204],
    ],
    {
      fill: palette.idle.bg,
      fillStyle: 'solid',
      stroke: palette.idle.border,
      strokeWidth: 2,
      seed: env.seed + 14,
    }
  );
  polygon(
    env,
    [
      [330, 204],
      [356, 178],
      [384, 204],
    ],
    {
      fill: palette.matched.bg,
      fillStyle: 'solid',
      stroke: palette.matched.border,
      strokeWidth: 2,
      seed: env.seed + 15,
    }
  );
  line(env, 416, 152, 416, 176, env.seed + 16, palette.minimum.border, 2.4, 1);
  line(env, 404, 164, 428, 164, env.seed + 17, palette.minimum.border, 2.4, 1);
  return env;
};

const projectSketches: Record<
  string,
  (canvas: HTMLCanvasElement) => DrawEnv | null
> = {
  '01': drawVizLearnSketch,
  '02': drawAouoAiSketch,
  '05': drawWatermarkSketch,
  '06': drawReactSketch,
  learn: drawLearnSketch,
  ship: drawShipSketch,
};

export const drawProjectSketch = (
  canvas: HTMLCanvasElement
): DrawEnv | null => {
  const draw = projectSketches[canvas.dataset.project || ''];
  return draw ? draw(canvas) : null;
};
