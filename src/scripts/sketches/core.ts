import rough from 'roughjs';
import type { Drawable, OpSet } from 'roughjs/bin/core';
import type { RoughGenerator } from 'roughjs/bin/generator';

export const FONT = '"Comic Neue", cursive';
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

export type SketchOp = {
  kind: 'stroke' | 'fill' | 'text';
  transform: DOMMatrix;
  // when true, this op starts together with the previous one on the timeline
  syncWithPrev?: boolean;
  alpha?: number;
  // stroke / fill
  path?: Path2D;
  length?: number;
  color?: string;
  width?: number;
  // text
  value?: string;
  x?: number;
  y?: number;
  size?: number;
  align?: CanvasTextAlign;
  weight?: 400 | 700;
  family?: string;
};

export type DrawEnv = {
  ctx: CanvasRenderingContext2D;
  gen: RoughGenerator;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  seed: number;
  ops: SketchOp[];
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
    gen: rough.generator(),
    canvas,
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
    ops: [],
  };
};

let measurePath: SVGPathElement | null = null;

const measureLength = (d: string): number => {
  if (!measurePath) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.overflow = 'hidden';
    svg.setAttribute('aria-hidden', 'true');
    measurePath = document.createElementNS(ns, 'path');
    svg.appendChild(measurePath);
    document.body.appendChild(svg);
  }
  measurePath.setAttribute('d', d);
  try {
    return measurePath.getTotalLength();
  } catch {
    return 200;
  }
};

const isVisibleColor = (color?: string): color is string =>
  Boolean(color) && color !== 'none' && color !== 'transparent';

const pushStrokeSet = (
  env: DrawEnv,
  d: string,
  color: string,
  width: number,
  extra?: { alpha?: number; syncWithPrev?: boolean }
) => {
  if (!d) return;
  env.ops.push({
    kind: 'stroke',
    path: new Path2D(d),
    length: measureLength(d),
    color,
    width,
    alpha: extra?.alpha,
    syncWithPrev: extra?.syncWithPrev,
    transform: env.ctx.getTransform(),
  });
};

export const pushDrawable = (env: DrawEnv, drawable: Drawable) => {
  const o = drawable.options;
  drawable.sets.forEach((set: OpSet) => {
    if (set.type === 'path' && isVisibleColor(o.stroke)) {
      pushStrokeSet(env, env.gen.opsToPath(set), o.stroke, o.strokeWidth);
    } else if (set.type === 'fillPath' && isVisibleColor(o.fill)) {
      env.ops.push({
        kind: 'fill',
        path: new Path2D(env.gen.opsToPath(set)),
        color: o.fill,
        transform: env.ctx.getTransform(),
      });
    } else if (set.type === 'fillSketch' && isVisibleColor(o.fill)) {
      pushStrokeSet(
        env,
        env.gen.opsToPath(set),
        o.fill,
        o.fillWeight || o.strokeWidth / 2
      );
    }
  });
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
  pushDrawable(
    env,
    env.gen.path(path, {
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
    })
  );

  if (ghostStroke) {
    pushStrokeSet(env, path, stroke, 1.1, { alpha: 0.14, syncWithPrev: true });
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
  pushDrawable(
    env,
    env.gen.line(x1, y1, x2, y2, {
      bowing,
      roughness,
      seed,
      stroke,
      strokeWidth,
    })
  );
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
  pushDrawable(
    env,
    env.gen.ellipse(cx, cy, width, height, {
      fill,
      fillStyle,
      roughness,
      seed,
      stroke,
      strokeWidth,
    })
  );
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
  env.ops.push({
    kind: 'text',
    value,
    x,
    y,
    size,
    color,
    align,
    weight,
    family,
    transform: env.ctx.getTransform(),
  });
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

// --- replay: turn recorded ops into a static frame or a hand-drawing animation ---

type TimedOp = { op: SketchOp; start: number; duration: number };

const TIMELINE_TARGET = 1700;

const opDuration = (op: SketchOp): number => {
  if (op.kind === 'stroke') return clamp((op.length || 0) * 1.6, 90, 380);
  if (op.kind === 'fill') return 160;
  return 180;
};

const buildTimeline = (
  env: DrawEnv
): { timeline: TimedOp[]; total: number } => {
  let cursor = 0;
  let prev: TimedOp | null = null;
  const timeline = env.ops.map((op) => {
    const duration = opDuration(op);
    let start = cursor;
    if (op.syncWithPrev && prev) {
      start = prev.start;
    } else {
      cursor = start + duration * 0.55;
    }
    const timed: TimedOp = { op, start, duration };
    prev = timed;
    return timed;
  });
  let total = timeline.reduce(
    (max, t) => Math.max(max, t.start + t.duration),
    0
  );
  if (total > TIMELINE_TARGET) {
    const scale = TIMELINE_TARGET / total;
    timeline.forEach((t) => {
      t.start *= scale;
      t.duration *= scale;
    });
    total = TIMELINE_TARGET;
  }
  return { timeline, total };
};

const drawOp = (env: DrawEnv, op: SketchOp, progress: number) => {
  const { ctx } = env;
  ctx.save();
  ctx.setTransform(op.transform);
  if (op.kind === 'text') {
    ctx.globalAlpha = progress;
    ctx.fillStyle = op.color || INK;
    ctx.font = `${op.weight} ${op.size}px ${op.family || FONT}`;
    ctx.textAlign = op.align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(op.value || '', op.x || 0, op.y || 0);
  } else if (op.kind === 'fill' && op.path) {
    ctx.globalAlpha = (op.alpha ?? 1) * progress;
    ctx.fillStyle = op.color || INK;
    ctx.fill(op.path);
  } else if (op.kind === 'stroke' && op.path) {
    ctx.globalAlpha = op.alpha ?? 1;
    ctx.strokeStyle = op.color || INK;
    ctx.lineWidth = op.width || 2;
    if (progress < 1 && op.length) {
      ctx.setLineDash([op.length, op.length]);
      ctx.lineDashOffset = op.length * (1 - progress);
    }
    ctx.stroke(op.path);
  }
  ctx.restore();
};

const renderFrame = (env: DrawEnv, timeline: TimedOp[], time: number) => {
  const { ctx, canvas } = env;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  timeline.forEach((t) => {
    if (time < t.start) return;
    drawOp(env, t.op, Math.min(1, (time - t.start) / t.duration));
  });
};

export const renderSketch = (env: DrawEnv) => {
  const { timeline } = buildTimeline(env);
  renderFrame(env, timeline, Number.POSITIVE_INFINITY);
};

export const animateSketch = (env: DrawEnv): (() => void) => {
  const { timeline, total } = buildTimeline(env);
  const startedAt = performance.now();
  let raf = 0;
  const frame = (now: number) => {
    const time = now - startedAt;
    renderFrame(env, timeline, time);
    if (time < total) {
      raf = requestAnimationFrame(frame);
    }
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
};
