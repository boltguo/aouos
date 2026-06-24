import rough from 'roughjs';
import type { RoughCanvas } from 'roughjs/bin/canvas';

export const FONT = '"Comic Neue", cursive';
export const MONO = '"JetBrains Mono", monospace';
export const INK = '#4a4138';
export const PENCIL = '#8a7b66';
export const TRACK = '#d8cdb8';
export const DIVIDER = '#d4c9b4';

export const palette = {
  idle: { bg: '#E3F2FD', border: '#1E88E5' },
  comparing: { bg: '#FFF3E0', border: '#FFB74D' },
  matched: { bg: '#E8F5E9', border: '#43A047' },
  error: { bg: '#FFDDDD', border: '#E88D8D' },
  minimum: { bg: '#F3E5F5', border: '#8E24AA' },
  cached: { bg: '#E0F2F1', border: '#4DB6AC' },
  empty: { bg: '#F5F5F5', border: '#888888' },
} as const;

export type ColorPair = (typeof palette)[keyof typeof palette];

export type DrawEnv = {
  ctx: CanvasRenderingContext2D;
  rc: RoughCanvas;
  width: number;
  height: number;
  seed: number;
};

type RectOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  roughness?: number;
  seed?: number;
  radius?: number;
  fillStyle?: 'solid' | 'hachure' | 'cross-hatch' | 'zigzag' | 'dots';
  ghostStroke?: boolean;
};

type EllipseOptions = {
  cx: number;
  cy: number;
  width: number;
  height: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  roughness?: number;
  seed?: number;
  fillStyle?: 'solid' | 'hachure' | 'cross-hatch' | 'zigzag' | 'dots';
};

export const seedFromText = (text: string): number => {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 100000;
};

export const prepareCanvas = (
  canvas: HTMLCanvasElement,
  logicalWidth?: number,
  logicalHeight?: number
): DrawEnv | null => {
  const width =
    logicalWidth ||
    Number(canvas.dataset.width || canvas.getAttribute('width')) ||
    480;
  const height =
    logicalHeight ||
    Number(canvas.dataset.height || canvas.getAttribute('height')) ||
    260;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const nextWidth = Math.max(1, Math.round(width * dpr));
  const nextHeight = Math.max(1, Math.round(height * dpr));

  if (canvas.width !== nextWidth) canvas.width = nextWidth;
  if (canvas.height !== nextHeight) canvas.height = nextHeight;
  canvas.style.aspectRatio = `${width} / ${height}`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  return {
    ctx,
    rc: rough.canvas(canvas),
    width,
    height,
    seed: seedFromText(
      [
        canvas.dataset.sketch,
        canvas.dataset.project,
        canvas.dataset.slug,
        canvas.dataset.variant,
      ].join(':')
    ),
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const cornerRadius = (minSide: number): number => {
  const adaptive = 32;
  const proportional = 0.25;
  const cutoff = adaptive / proportional;
  return minSide <= cutoff ? minSide * proportional : adaptive;
};

const adjustRoughness = (
  width: number,
  height: number,
  roughness: number,
  hasRoundness: boolean
) => {
  const maxSize = Math.max(width, height);
  const minSize = Math.min(width, height);
  if ((minSize >= 20 && maxSize >= 50) || (minSize >= 15 && hasRoundness)) {
    return roughness;
  }
  return Math.min(roughness / (maxSize < 10 ? 3 : 2), 2.5);
};

const roundedRectPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = clamp(radius, 0, Math.min(width, height) / 2);
  if (!r) {
    return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
  }
  return [
    `M ${x + r} ${y}`,
    `L ${x + width - r} ${y}`,
    `Q ${x + width} ${y}, ${x + width} ${y + r}`,
    `L ${x + width} ${y + height - r}`,
    `Q ${x + width} ${y + height}, ${x + width - r} ${y + height}`,
    `L ${x + r} ${y + height}`,
    `Q ${x} ${y + height}, ${x} ${y + height - r}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y}, ${x + r} ${y}`,
    'Z',
  ].join(' ');
};

export const rect = (
  env: DrawEnv,
  {
    x,
    y,
    width,
    height,
    stroke = INK,
    fill = 'transparent',
    strokeWidth = 2,
    roughness = 1,
    seed = env.seed,
    radius,
    fillStyle = 'solid',
    ghostStroke = true,
  }: RectOptions
) => {
  const finalRadius = radius ?? cornerRadius(Math.min(width, height));
  const path = roundedRectPath(x, y, width, height, finalRadius);
  env.rc.path(path, {
    seed,
    stroke,
    strokeWidth,
    roughness: adjustRoughness(width, height, roughness, finalRadius > 0),
    fill,
    fillStyle,
    fillWeight: strokeWidth / 2,
    hachureGap: strokeWidth * 4,
    preserveVertices: true,
    bowing: 1.1,
  });

  if (ghostStroke && typeof Path2D !== 'undefined') {
    env.ctx.save();
    env.ctx.globalAlpha = 0.14;
    env.ctx.lineWidth = 1.1;
    env.ctx.strokeStyle = stroke;
    env.ctx.stroke(new Path2D(path));
    env.ctx.restore();
  }
};

export const line = (
  env: DrawEnv,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed = env.seed,
  stroke = INK,
  strokeWidth = 2.4,
  roughness = 1.2,
  bowing = 1.1
) => {
  env.rc.line(x1, y1, x2, y2, {
    bowing,
    roughness,
    seed,
    stroke,
    strokeWidth,
  });
};

export const ellipse = (
  env: DrawEnv,
  {
    cx,
    cy,
    width,
    height,
    stroke = INK,
    fill = 'transparent',
    strokeWidth = 2,
    roughness = 1,
    seed = env.seed,
    fillStyle = 'solid',
  }: EllipseOptions
) => {
  env.rc.ellipse(cx, cy, width, height, {
    fill,
    fillStyle,
    roughness,
    seed,
    stroke,
    strokeWidth,
  });
};

export const text = (
  env: DrawEnv,
  value: string,
  x: number,
  y: number,
  size: number,
  color = INK,
  align: CanvasTextAlign = 'left',
  weight: 400 | 700 = 400,
  family = FONT
) => {
  env.ctx.save();
  env.ctx.fillStyle = color;
  env.ctx.font = `${weight} ${size}px ${family}`;
  env.ctx.textAlign = align;
  env.ctx.textBaseline = 'alphabetic';
  env.ctx.fillText(value, x, y);
  env.ctx.restore();
};

export const arrow = (
  env: DrawEnv,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed = env.seed,
  color = INK
) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 11;
  line(env, x1, y1, x2, y2, seed, color, 2.4, 1.2);
  line(
    env,
    x2,
    y2,
    x2 - head * Math.cos(angle - 0.4),
    y2 - head * Math.sin(angle - 0.4),
    seed + 1,
    color,
    2.4,
    1
  );
  line(
    env,
    x2,
    y2,
    x2 - head * Math.cos(angle + 0.4),
    y2 - head * Math.sin(angle + 0.4),
    seed + 2,
    color,
    2.4,
    1
  );
};

export const node = (
  env: DrawEnv,
  x: number,
  y: number,
  label: string,
  color: ColorPair,
  seed = env.seed
) => {
  ellipse(env, {
    cx: x,
    cy: y,
    width: 48,
    height: 42,
    fill: color.bg,
    stroke: color.border,
    strokeWidth: 2.4,
    seed,
  });
  text(env, label, x, y + 8, 20, INK, 'center', 700);
};

export const labelChip = (
  env: DrawEnv,
  x: number,
  y: number,
  label: string,
  color: ColorPair,
  seed = env.seed
) => {
  const width = Math.max(70, label.length * 10 + 28);
  rect(env, {
    x,
    y,
    width,
    height: 34,
    fill: color.bg,
    stroke: color.border,
    strokeWidth: 2,
    roughness: 1.1,
    radius: 13,
    seed,
  });
  text(env, label, x + width / 2, y + 23, 18, INK, 'center', 700);
};
