import {
  INK,
  PENCIL,
  type DrawEnv,
  arrow,
  ellipse,
  line,
  palette,
  prepareCanvas,
  pushDrawable,
  rect,
  text,
} from './core';

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

// VizLearn: a larger sorting trace flowing into a connected graph
const drawVizLearnSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 560, 320);
  if (!env) return null;

  const baseline = 264;
  const chartOffsetX = -18;
  const barX = [36, 78, 120, 162, 204, 246].map((x) => x + chartOffsetX);
  const barH = [82, 138, 188, 112, 160, 98];
  const compare = [false, true, true, false, false, false];
  barX.forEach((x, index) => {
    const tone = compare[index]
      ? palette.comparing
      : index === 4
        ? palette.matched
        : palette.idle;
    rect(env, {
      x,
      y: baseline - barH[index],
      width: 32,
      height: barH[index],
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2.6,
      roughness: 1.05,
      radius: 8,
      seed: env.seed + index,
    });
  });
  line(
    env,
    28 + chartOffsetX,
    baseline,
    294 + chartOffsetX,
    baseline,
    env.seed + 9,
    INK,
    2.5,
    1
  );
  arrow(
    env,
    90 + chartOffsetX,
    56,
    184 + chartOffsetX,
    56,
    env.seed + 10,
    palette.comparing.border
  );
  arrow(
    env,
    188 + chartOffsetX,
    78,
    116 + chartOffsetX,
    78,
    env.seed + 11,
    palette.matched.border
  );

  const graphOffsetX = 10;
  const graphNodes = [
    { x: 420 + graphOffsetX, y: 54, tone: palette.idle },
    { x: 350 + graphOffsetX, y: 132, tone: palette.matched },
    { x: 490 + graphOffsetX, y: 132, tone: palette.comparing },
    { x: 316 + graphOffsetX, y: 230, tone: palette.minimum },
    { x: 386 + graphOffsetX, y: 230, tone: palette.idle },
    { x: 458 + graphOffsetX, y: 230, tone: palette.cached },
    { x: 526 + graphOffsetX, y: 230, tone: palette.matched },
  ] as const;
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 5],
  ] as const;
  edges.forEach(([from, to], index) => {
    const a = graphNodes[from];
    const b = graphNodes[to];
    line(env, a.x, a.y, b.x, b.y, env.seed + 20 + index, PENCIL, 2.4, 1);
  });
  graphNodes.forEach(({ x, y, tone }, index) => {
    ellipse(env, {
      cx: x,
      cy: y,
      width: index === 0 ? 52 : 44,
      height: index === 0 ? 52 : 44,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2.8,
      roughness: 1,
      seed: env.seed + 40 + index,
    });
    ellipse(env, {
      cx: x,
      cy: y,
      width: 10,
      height: 10,
      fill: tone.border,
      stroke: tone.border,
      strokeWidth: 1,
      roughness: 0.6,
      seed: env.seed + 60 + index,
    });
  });

  return env;
};

// KanaPlanet: the daily learning route and kana practice grid
const drawKanaPlanetSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 560, 320);
  if (!env) return null;

  const kanaRed = '#B83A2D';
  const kanaRedSoft = '#F3D8D0';
  const kanaCream = '#FBF7EE';
  const kanaLine = '#D9CFBC';
  const kanaTeal = '#225564';

  // Main desktop learning dashboard.
  rect(env, {
    x: 18,
    y: 22,
    width: 366,
    height: 276,
    fill: kanaCream,
    stroke: INK,
    strokeWidth: 2.8,
    roughness: 0.9,
    radius: 18,
    seed: env.seed + 1,
  });
  line(env, 18, 54, 384, 54, env.seed + 2, kanaLine, 2, 0.8);
  [36, 50, 64].forEach((cx, index) => {
    ellipse(env, {
      cx,
      cy: 38,
      width: 7,
      height: 7,
      fill: index === 0 ? kanaRedSoft : palette.empty.bg,
      stroke: index === 0 ? kanaRed : PENCIL,
      strokeWidth: 1.3,
      roughness: 0.6,
      seed: env.seed + 3 + index,
    });
  });

  // Compact left navigation with the KanaPlanet mark.
  rect(env, {
    x: 30,
    y: 66,
    width: 66,
    height: 218,
    fill: '#FFFFFF',
    stroke: kanaLine,
    strokeWidth: 2,
    roughness: 0.8,
    radius: 14,
    seed: env.seed + 7,
  });
  rect(env, {
    x: 44,
    y: 80,
    width: 38,
    height: 38,
    fill: kanaRed,
    stroke: kanaRed,
    strokeWidth: 1.8,
    roughness: 0.7,
    radius: 10,
    seed: env.seed + 8,
  });
  text(env, 'あ', 63, 107, 25, '#FFFFFF', 'center', 700, 'serif');
  [136, 172, 208, 244].forEach((cy, index) => {
    const active = index === 0;
    rect(env, {
      x: 40,
      y: cy,
      width: 46,
      height: 24,
      fill: active ? kanaRedSoft : 'transparent',
      stroke: active ? kanaRedSoft : 'transparent',
      strokeWidth: 1,
      roughness: 0.5,
      radius: 8,
      seed: env.seed + 9 + index,
    });
    line(
      env,
      50,
      cy + 12,
      76,
      cy + 12,
      env.seed + 14 + index,
      active ? kanaRed : PENCIL,
      active ? 3 : 2,
      0.7
    );
  });

  // Greeting and today plan.
  text(env, 'こんにちは', 116, 76, 17, INK, 'left', 700, 'serif');
  line(env, 116, 86, 194, 86, env.seed + 20, PENCIL, 1.8, 0.7);
  rect(env, {
    x: 110,
    y: 98,
    width: 256,
    height: 94,
    fill: kanaRed,
    stroke: kanaRed,
    strokeWidth: 2.4,
    roughness: 0.9,
    radius: 15,
    seed: env.seed + 21,
  });
  text(env, '今日计划', 128, 119, 11, '#FFFFFF', 'left', 700, 'sans-serif');
  [124, 230].forEach((x, index) => {
    rect(env, {
      x,
      y: 130,
      width: index === 0 ? 94 : 120,
      height: 30,
      fill: '#D56B61',
      stroke: '#D56B61',
      strokeWidth: 1.4,
      roughness: 0.7,
      radius: 9,
      seed: env.seed + 22 + index,
    });
    ellipse(env, {
      cx: x + 14,
      cy: 145,
      width: 18,
      height: 18,
      fill: '#FFFFFF',
      stroke: '#FFFFFF',
      strokeWidth: 1,
      roughness: 0.5,
      seed: env.seed + 24 + index,
    });
    text(env, String(index + 1), x + 14, 150, 12, kanaRed, 'center', 700);
  });
  rect(env, {
    x: 124,
    y: 166,
    width: 228,
    height: 16,
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
    strokeWidth: 1,
    roughness: 0.55,
    radius: 6,
    seed: env.seed + 26,
  });

  // Progress and the daily false-friend word.
  rect(env, {
    x: 110,
    y: 204,
    width: 256,
    height: 42,
    fill: '#FFFFFF',
    stroke: kanaLine,
    strokeWidth: 1.8,
    roughness: 0.75,
    radius: 10,
    seed: env.seed + 27,
  });
  text(env, '入门打底', 124, 222, 12, INK, 'left', 700, 'serif');
  line(env, 124, 234, 350, 234, env.seed + 28, kanaLine, 4, 0.6);
  line(env, 124, 234, 164, 234, env.seed + 29, kanaTeal, 4, 0.6);
  rect(env, {
    x: 110,
    y: 256,
    width: 256,
    height: 27,
    fill: kanaRedSoft,
    stroke: kanaRedSoft,
    strokeWidth: 1,
    roughness: 0.65,
    radius: 8,
    seed: env.seed + 30,
  });
  text(env, '手紙  →  信', 128, 275, 14, kanaRed, 'left', 700, 'serif');

  // Kana chart shown beside the dashboard.
  rect(env, {
    x: 402,
    y: 36,
    width: 140,
    height: 248,
    fill: '#FFFFFF',
    stroke: kanaLine,
    strokeWidth: 2.2,
    roughness: 0.85,
    radius: 17,
    seed: env.seed + 31,
  });
  text(env, '五十音', 472, 59, 18, INK, 'center', 700, 'serif');
  rect(env, {
    x: 416,
    y: 70,
    width: 112,
    height: 22,
    fill: '#E7E1D7',
    stroke: kanaLine,
    strokeWidth: 1.2,
    roughness: 0.6,
    radius: 10,
    seed: env.seed + 32,
  });
  rect(env, {
    x: 416,
    y: 70,
    width: 56,
    height: 22,
    fill: '#FFFFFF',
    stroke: kanaLine,
    strokeWidth: 1.1,
    roughness: 0.55,
    radius: 10,
    seed: env.seed + 33,
  });
  const kana = [
    'あ',
    'い',
    'う',
    'え',
    'お',
    'か',
    'き',
    'く',
    'け',
    'こ',
    'さ',
    'し',
  ];
  kana.forEach((value, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 416 + col * 38;
    const y = 105 + row * 38;
    rect(env, {
      x,
      y,
      width: 34,
      height: 31,
      fill: kanaCream,
      stroke: kanaLine,
      strokeWidth: 1.3,
      roughness: 0.65,
      radius: 7,
      seed: env.seed + 34 + index,
    });
    text(env, value, x + 17, y + 22, 16, INK, 'center', 400, 'serif');
  });
  [424, 454, 484, 514].forEach((x, index) => {
    ellipse(env, {
      cx: x,
      cy: 267,
      width: index === 0 ? 9 : 6,
      height: index === 0 ? 9 : 6,
      fill: index === 0 ? kanaRed : kanaLine,
      stroke: index === 0 ? kanaRed : kanaLine,
      strokeWidth: 1,
      roughness: 0.55,
      seed: env.seed + 50 + index,
    });
  });
  return env;
};

// learn — inputs, code, visuals, and trace history stay in sync
const drawLearnSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

  rect(env, {
    x: 20,
    y: 24,
    width: 440,
    height: 212,
    fill: '#ffffff',
    stroke: INK,
    strokeWidth: 2.5,
    roughness: 0.95,
    radius: 14,
    seed: env.seed + 1,
  });
  line(env, 20, 62, 460, 62, env.seed + 2, INK, 2.1, 0.9);
  [40, 56, 72].forEach((cx, index) => {
    ellipse(env, {
      cx,
      cy: 43,
      width: 9,
      height: 9,
      fill: index === 0 ? palette.error.bg : palette.empty.bg,
      stroke: index === 0 ? palette.error.border : PENCIL,
      strokeWidth: 1.7,
      roughness: 0.7,
      seed: env.seed + 3 + index,
    });
  });

  rect(env, {
    x: 38,
    y: 78,
    width: 96,
    height: 108,
    fill: palette.cached.bg,
    stroke: palette.cached.border,
    strokeWidth: 2.1,
    roughness: 0.9,
    radius: 10,
    seed: env.seed + 10,
  });
  rect(env, {
    x: 154,
    y: 78,
    width: 142,
    height: 108,
    fill: palette.idle.bg,
    stroke: palette.idle.border,
    strokeWidth: 2.1,
    roughness: 0.9,
    radius: 10,
    seed: env.seed + 11,
  });
  rect(env, {
    x: 316,
    y: 78,
    width: 126,
    height: 108,
    fill: palette.comparing.bg,
    stroke: palette.comparing.border,
    strokeWidth: 2.1,
    roughness: 0.9,
    radius: 10,
    seed: env.seed + 12,
  });
  arrow(env, 137, 132, 151, 132, env.seed + 13, PENCIL);
  arrow(env, 299, 132, 313, 132, env.seed + 14, PENCIL);

  [101, 132, 163].forEach((y, index) => {
    line(env, 50, y, 121, y, env.seed + 20 + index, PENCIL, 2.2, 0.8);
    ellipse(env, {
      cx: [80, 106, 66][index],
      cy: y,
      width: 15,
      height: 15,
      fill: [palette.idle.bg, palette.matched.bg, palette.minimum.bg][index],
      stroke: [
        palette.idle.border,
        palette.matched.border,
        palette.minimum.border,
      ][index],
      strokeWidth: 2,
      roughness: 0.7,
      seed: env.seed + 24 + index,
    });
  });

  [99, 117, 135, 153, 171].forEach((y, index) => {
    line(
      env,
      169 + (index % 2) * 10,
      y,
      275 - (index % 3) * 18,
      y,
      env.seed + 30 + index,
      index === 2 ? palette.minimum.border : PENCIL,
      index === 2 ? 2.7 : 2.1,
      0.75
    );
  });

  [
    { x: 329, h: 35, tone: palette.idle },
    { x: 350, h: 58, tone: palette.matched },
    { x: 371, h: 78, tone: palette.comparing },
  ].forEach(({ x, h, tone }, index) => {
    rect(env, {
      x,
      y: 174 - h,
      width: 14,
      height: h,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 1.9,
      roughness: 0.8,
      radius: 4,
      seed: env.seed + 40 + index,
    });
  });
  line(env, 407, 107, 397, 142, env.seed + 44, PENCIL, 1.9, 0.8);
  line(env, 407, 107, 427, 145, env.seed + 45, PENCIL, 1.9, 0.8);
  [
    { cx: 407, cy: 101, tone: palette.minimum },
    { cx: 397, cy: 150, tone: palette.idle },
    { cx: 427, cy: 153, tone: palette.cached },
  ].forEach(({ cx, cy, tone }, index) => {
    ellipse(env, {
      cx,
      cy,
      width: 18,
      height: 18,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 1.9,
      roughness: 0.75,
      seed: env.seed + 46 + index,
    });
  });

  line(env, 48, 213, 432, 213, env.seed + 50, PENCIL, 2, 0.8);
  [72, 148, 224, 300, 376].forEach((cx, index) => {
    const active = index <= 2;
    ellipse(env, {
      cx,
      cy: 213,
      width: index === 2 ? 17 : 11,
      height: index === 2 ? 17 : 11,
      fill: active ? palette.idle.border : palette.empty.bg,
      stroke: active ? palette.idle.border : PENCIL,
      strokeWidth: 1.7,
      roughness: 0.7,
      seed: env.seed + 52 + index,
    });
  });
  return env;
};

// ship — start from friction, prune complexity, and ship focused tools
const drawShipSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 480, 260);
  if (!env) return null;

  rect(env, {
    x: 22,
    y: 74,
    width: 104,
    height: 110,
    fill: palette.comparing.bg,
    stroke: palette.comparing.border,
    strokeWidth: 2.5,
    roughness: 1,
    radius: 18,
    seed: env.seed + 1,
  });
  pushDrawable(
    env,
    env.gen.path(
      'M 40 147 C 51 95, 92 171, 110 111 C 89 84, 52 171, 39 113 C 67 91, 101 144, 110 158',
      {
        stroke: palette.comparing.border,
        strokeWidth: 3,
        roughness: 1.3,
        seed: env.seed + 2,
        fill: 'transparent',
      }
    )
  );
  [
    { cx: 44, cy: 104, tone: palette.error },
    { cx: 104, cy: 98, tone: palette.minimum },
    { cx: 82, cy: 164, tone: palette.idle },
  ].forEach(({ cx, cy, tone }, index) => {
    ellipse(env, {
      cx,
      cy,
      width: 14,
      height: 14,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 1.8,
      roughness: 0.75,
      seed: env.seed + 3 + index,
    });
  });

  arrow(env, 136, 130, 160, 130, env.seed + 7, INK);

  ellipse(env, {
    cx: 212,
    cy: 54,
    width: 32,
    height: 32,
    fill: palette.minimum.bg,
    stroke: palette.minimum.border,
    strokeWidth: 2.3,
    roughness: 0.85,
    seed: env.seed + 8,
  });
  [180, 212, 244].forEach((cx, index) => {
    line(env, 212, 69, cx, 105, env.seed + 9 + index, PENCIL, 2.1, 0.9);
  });
  [
    { cx: 180, tone: palette.error },
    { cx: 212, tone: palette.matched },
    { cx: 244, tone: palette.error },
  ].forEach(({ cx, tone }, index) => {
    ellipse(env, {
      cx,
      cy: 116,
      width: 24,
      height: 24,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2.1,
      roughness: 0.8,
      seed: env.seed + 13 + index,
    });
  });
  [180, 244].forEach((cx, index) => {
    line(
      env,
      cx - 10,
      106,
      cx + 10,
      126,
      env.seed + 17 + index * 2,
      palette.error.border,
      2.6,
      0.85
    );
    line(
      env,
      cx + 10,
      106,
      cx - 10,
      126,
      env.seed + 18 + index * 2,
      palette.error.border,
      2.6,
      0.85
    );
  });
  line(
    env,
    212,
    129,
    212,
    160,
    env.seed + 21,
    palette.matched.border,
    2.7,
    0.8
  );
  ellipse(env, {
    cx: 212,
    cy: 171,
    width: 22,
    height: 22,
    fill: palette.matched.bg,
    stroke: palette.matched.border,
    strokeWidth: 2.2,
    roughness: 0.75,
    seed: env.seed + 22,
  });
  arrow(env, 227, 171, 284, 171, env.seed + 23, palette.matched.border);

  rect(env, {
    x: 292,
    y: 26,
    width: 166,
    height: 94,
    fill: '#ffffff',
    stroke: INK,
    strokeWidth: 2.3,
    roughness: 0.9,
    radius: 12,
    seed: env.seed + 25,
  });
  rect(env, {
    x: 307,
    y: 40,
    width: 46,
    height: 66,
    fill: palette.empty.bg,
    stroke: INK,
    strokeWidth: 2,
    roughness: 0.8,
    radius: 9,
    seed: env.seed + 26,
  });
  rect(env, {
    x: 317,
    y: 48,
    width: 26,
    height: 7,
    fill: INK,
    stroke: INK,
    strokeWidth: 1,
    roughness: 0.55,
    radius: 4,
    seed: env.seed + 27,
  });
  [
    [316, 66],
    [333, 66],
    [316, 83],
  ].forEach(([x, y], index) => {
    rect(env, {
      x,
      y,
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: palette.idle.border,
      strokeWidth: 1.8,
      roughness: 0.6,
      radius: 1,
      seed: env.seed + 28 + index,
    });
  });
  rect(env, {
    x: 372,
    y: 46,
    width: 70,
    height: 25,
    fill: INK,
    stroke: INK,
    strokeWidth: 1.4,
    roughness: 0.65,
    radius: 13,
    seed: env.seed + 32,
  });
  [palette.idle, palette.comparing, palette.matched].forEach((tone, index) => {
    ellipse(env, {
      cx: 385 + index * 24,
      cy: 92,
      width: 15,
      height: 15,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 1.7,
      roughness: 0.7,
      seed: env.seed + 33 + index,
    });
  });

  rect(env, {
    x: 292,
    y: 138,
    width: 166,
    height: 94,
    fill: '#ffffff',
    stroke: INK,
    strokeWidth: 2.3,
    roughness: 0.9,
    radius: 12,
    seed: env.seed + 38,
  });
  const imageFrame = (x: number, seed: number, clean: boolean) => {
    rect(env, {
      x,
      y: 154,
      width: 56,
      height: 60,
      fill: clean ? palette.matched.bg : palette.empty.bg,
      stroke: clean ? palette.matched.border : PENCIL,
      strokeWidth: 1.9,
      roughness: 0.75,
      radius: 7,
      seed,
    });
    ellipse(env, {
      cx: x + 14,
      cy: 168,
      width: 10,
      height: 10,
      fill: palette.comparing.bg,
      stroke: palette.comparing.border,
      strokeWidth: 1.5,
      roughness: 0.65,
      seed: seed + 1,
    });
    polygon(
      env,
      [
        [x + 7, 205],
        [x + 27, 178],
        [x + 49, 205],
      ],
      {
        fill: palette.idle.bg,
        fillStyle: 'solid',
        stroke: palette.idle.border,
        strokeWidth: 1.7,
        roughness: 0.7,
        seed: seed + 2,
      }
    );
  };
  imageFrame(307, env.seed + 40, false);
  imageFrame(389, env.seed + 44, true);
  line(env, 313, 204, 357, 163, env.seed + 48, palette.error.border, 3, 1);
  arrow(env, 367, 184, 385, 184, env.seed + 49, INK);
  line(
    env,
    426,
    158,
    431,
    164,
    env.seed + 50,
    palette.matched.border,
    2.6,
    0.7
  );
  line(
    env,
    431,
    164,
    442,
    151,
    env.seed + 51,
    palette.matched.border,
    2.6,
    0.7
  );
  return env;
};

const projectSketches: Record<
  string,
  (canvas: HTMLCanvasElement) => DrawEnv | null
> = {
  '01': drawVizLearnSketch,
  '02': drawKanaPlanetSketch,
  learn: drawLearnSketch,
  ship: drawShipSketch,
};

export const drawProjectSketch = (
  canvas: HTMLCanvasElement
): DrawEnv | null => {
  const draw = projectSketches[canvas.dataset.project || ''];
  return draw ? draw(canvas) : null;
};
