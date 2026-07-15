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
  const barX = [36, 78, 120, 162, 204, 246].map(
    (x) => x + chartOffsetX
  );
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

// CodePin: a QR code moving from the app to a Live Activity surface
const drawCodePinSketch = (canvas: HTMLCanvasElement) => {
  const env = prepareCanvas(canvas, 560, 320);
  if (!env) return null;

  rect(env, {
    x: 38,
    y: 14,
    width: 232,
    height: 292,
    fill: palette.empty.bg,
    stroke: INK,
    strokeWidth: 2.8,
    roughness: 0.85,
    radius: 30,
    seed: env.seed + 1,
  });
  rect(env, {
    x: 105,
    y: 28,
    width: 98,
    height: 22,
    fill: INK,
    stroke: INK,
    strokeWidth: 1.5,
    roughness: 0.65,
    radius: 10,
    seed: env.seed + 2,
  });

  rect(env, {
    x: 72,
    y: 76,
    width: 164,
    height: 164,
    fill: '#ffffff',
    stroke: palette.idle.border,
    strokeWidth: 2.7,
    roughness: 0.75,
    radius: 20,
    seed: env.seed + 3,
  });

  const finder = (
    x: number,
    y: number,
    size: number,
    seed: number,
    stroke = INK
  ) => {
    rect(env, {
      x,
      y,
      width: size,
      height: size,
      fill: 'transparent',
      stroke,
      strokeWidth: Math.max(2.2, size * 0.14),
      roughness: 0.55,
      radius: 2,
      seed,
    });
    rect(env, {
      x: x + size * 0.32,
      y: y + size * 0.32,
      width: size * 0.36,
      height: size * 0.36,
      fill: stroke,
      stroke,
      strokeWidth: 1,
      roughness: 0.45,
      radius: 1,
      seed: seed + 1,
    });
  };
  finder(90, 94, 36, env.seed + 10);
  finder(182, 94, 36, env.seed + 12);
  finder(90, 186, 36, env.seed + 14);

  const modules: [number, number][] = [
    [140, 98],
    [152, 98],
    [140, 110],
    [164, 122],
    [140, 146],
    [152, 146],
    [176, 146],
    [188, 158],
    [140, 170],
    [164, 182],
    [176, 194],
    [200, 206],
    [152, 218],
    [176, 218],
  ];
  modules.forEach(([x, y], index) => {
    rect(env, {
      x,
      y,
      width: 9,
      height: 9,
      fill: INK,
      stroke: INK,
      strokeWidth: 1,
      roughness: 0.45,
      radius: 1,
      seed: env.seed + 20 + index,
    });
  });

  line(env, 118, 270, 190, 270, env.seed + 40, PENCIL, 3, 0.8);
  arrow(env, 280, 158, 320, 158, env.seed + 41, palette.idle.border);

  rect(env, {
    x: 326,
    y: 58,
    width: 212,
    height: 118,
    fill: '#ffffff',
    stroke: INK,
    strokeWidth: 2.6,
    roughness: 0.9,
    radius: 30,
    seed: env.seed + 42,
  });
  rect(env, {
    x: 346,
    y: 78,
    width: 88,
    height: 25,
    fill: INK,
    stroke: INK,
    strokeWidth: 1.4,
    roughness: 0.55,
    radius: 13,
    seed: env.seed + 43,
  });
  rect(env, {
    x: 458,
    y: 78,
    width: 58,
    height: 58,
    fill: palette.idle.bg,
    stroke: palette.idle.border,
    strokeWidth: 2.1,
    roughness: 0.65,
    radius: 10,
    seed: env.seed + 44,
  });
  finder(470, 90, 14, env.seed + 45, palette.idle.border);
  finder(491, 90, 14, env.seed + 47, palette.idle.border);
  finder(470, 111, 14, env.seed + 49, palette.idle.border);

  [palette.idle, palette.comparing, palette.matched].forEach((tone, index) => {
    ellipse(env, {
      cx: 366 + index * 34,
      cy: 139,
      width: 20,
      height: 20,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2,
      roughness: 0.8,
      seed: env.seed + 52 + index,
    });
  });

  const tiles = [
    { x: 340, tone: palette.comparing },
    { x: 416, tone: palette.matched },
    { x: 492, tone: palette.minimum },
  ] as const;
  tiles.forEach(({ x, tone }, index) => {
    rect(env, {
      x,
      y: 208,
      width: 58,
      height: 58,
      fill: tone.bg,
      stroke: tone.border,
      strokeWidth: 2.2,
      roughness: 0.85,
      radius: 13,
      seed: env.seed + 60 + index,
    });
    rect(env, {
      x: x + 17,
      y: 225,
      width: 24,
      height: 24,
      fill: '#ffffff',
      stroke: tone.border,
      strokeWidth: 1.8,
      roughness: 0.6,
      radius: 4,
      seed: env.seed + 64 + index,
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
  '02': drawCodePinSketch,
  learn: drawLearnSketch,
  ship: drawShipSketch,
};

export const drawProjectSketch = (
  canvas: HTMLCanvasElement
): DrawEnv | null => {
  const draw = projectSketches[canvas.dataset.project || ''];
  return draw ? draw(canvas) : null;
};
