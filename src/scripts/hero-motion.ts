import rough from 'roughjs';
import type { RoughCanvas } from 'roughjs/bin/canvas';

const INK = '#4a4138';
const BLUE = '#1e88e5';
const GREEN = '#43a047';
const RED = '#e88d8d';
const AMBER = '#ffb74d';
const LILAC = '#8e24aa';

// redraw ~11fps so the wobble reads as a hand-drawn "boil", not smooth motion
const FRAME_MS = 88;
const BOIL_MS = 240;

const roundRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string =>
  `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} ` +
  `L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} ` +
  `L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} ` +
  `L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

type Scene = {
  rc: RoughCanvas;
  ctx: CanvasRenderingContext2D;
  seed: number;
};

// drawn around its original (250, 216) center, then shifted to (cx, cy)
const controller = (
  { rc, ctx, seed }: Scene,
  t: number,
  cx = 250,
  cy = 216
) => {
  const sway = Math.sin(t / 1400) * 0.05;
  const bob = Math.sin(t / 1400 + 1.2) * 4;

  ctx.save();
  ctx.translate(cx - 250, cy - 216);
  ctx.translate(250, 216 + bob);
  ctx.rotate(sway);
  ctx.translate(-250, -216);

  rc.path(roundRect(150, 170, 200, 92, 38), {
    stroke: INK,
    strokeWidth: 2.6,
    fill: '#ffffff',
    fillStyle: 'solid',
    roughness: 1.3,
    seed,
  });
  // d-pad
  rc.line(194, 216, 226, 216, {
    stroke: INK,
    strokeWidth: 5,
    roughness: 1,
    seed: seed + 1,
  });
  rc.line(210, 200, 210, 232, {
    stroke: INK,
    strokeWidth: 5,
    roughness: 1,
    seed: seed + 2,
  });
  // face buttons
  rc.circle(298, 204, 21, {
    stroke: BLUE,
    strokeWidth: 2.2,
    fill: '#E3F2FD',
    fillStyle: 'solid',
    roughness: 1,
    seed: seed + 3,
  });
  rc.circle(322, 228, 21, {
    stroke: RED,
    strokeWidth: 2.2,
    fill: '#FFDDDD',
    fillStyle: 'solid',
    roughness: 1,
    seed: seed + 4,
  });
  // start / select
  rc.line(248, 206, 260, 206, {
    stroke: INK,
    strokeWidth: 2.6,
    roughness: 1,
    seed: seed + 5,
  });
  rc.line(248, 216, 260, 216, {
    stroke: INK,
    strokeWidth: 2.6,
    roughness: 1,
    seed: seed + 6,
  });

  ctx.restore();
};

const musicNote = (
  { rc, ctx, seed }: Scene,
  t: number,
  x: number,
  y: number,
  size: number,
  color: string,
  phase: number
) => {
  const bob = Math.sin(t / 1100 + phase) * 7;
  const tilt = Math.sin(t / 1500 + phase) * 0.12;

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(tilt);

  rc.ellipse(0, 0, size * 0.95, size * 0.66, {
    stroke: color,
    strokeWidth: 2,
    fill: color,
    fillStyle: 'solid',
    roughness: 1,
    seed,
  });
  rc.line(size * 0.42, -size * 0.08, size * 0.42, -size * 1.9, {
    stroke: color,
    strokeWidth: 2.4,
    roughness: 1,
    seed: seed + 1,
  });
  rc.path(
    `M ${size * 0.42} ${-size * 1.9} Q ${size * 1.35} ${-size * 1.5} ${size * 1.05} ${-size * 0.7}`,
    { stroke: color, strokeWidth: 2.2, roughness: 1, seed: seed + 2 }
  );

  ctx.restore();
};

const equalizer = ({ rc, seed }: Scene, t: number, baseX = 86, baseY = 318) => {
  [BLUE, AMBER, GREEN].forEach((color, i) => {
    const h = 20 + (Math.sin(t / 420 + i * 1.15) * 0.5 + 0.5) * 30;
    rc.line(baseX + i * 19, baseY, baseX + i * 19, baseY - h, {
      stroke: color,
      strokeWidth: 7,
      roughness: 1,
      seed: seed + i,
    });
  });
};

const animeTv = ({ rc, ctx, seed }: Scene, t: number, cx = 416, cy = 108) => {
  const tilt = Math.sin(t / 1700 + 0.6) * 0.04;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.translate(-cx, -cy);

  // antennas
  rc.line(cx - 8, cy - 44, cx - 28, cy - 72, {
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.2,
    seed: seed + 1,
  });
  rc.line(cx + 8, cy - 44, cx + 26, cy - 74, {
    stroke: INK,
    strokeWidth: 2.4,
    roughness: 1.2,
    seed: seed + 2,
  });
  // body + screen
  rc.path(roundRect(cx - 62, cy - 44, 124, 92, 14), {
    stroke: INK,
    strokeWidth: 2.6,
    fill: '#ffffff',
    fillStyle: 'solid',
    roughness: 1.3,
    seed,
  });
  rc.path(roundRect(cx - 48, cy - 30, 76, 64, 9), {
    stroke: LILAC,
    strokeWidth: 2.2,
    fill: '#F3E5F5',
    fillStyle: 'solid',
    roughness: 1.1,
    seed: seed + 3,
  });
  // knobs
  rc.circle(cx + 44, cy - 12, 11, {
    stroke: INK,
    strokeWidth: 2,
    roughness: 1,
    seed: seed + 4,
  });
  rc.circle(cx + 44, cy + 10, 11, {
    stroke: INK,
    strokeWidth: 2,
    roughness: 1,
    seed: seed + 5,
  });
  // an anime face on the screen: big sparkly eyes that blink, blush, tiny smile
  // blink lands late in the cycle so the reduced-motion still frame (t=0) has open eyes
  const blink = t % 3400 > 3220;
  [cx - 25, cx + 5].forEach((ex, i) => {
    if (blink) {
      rc.line(ex - 7, cy - 4, ex + 7, cy - 4, {
        stroke: INK,
        strokeWidth: 2.6,
        roughness: 0.9,
        seed: seed + 6 + i,
      });
    } else {
      rc.circle(ex, cy - 4, 15, {
        stroke: INK,
        strokeWidth: 2,
        fill: INK,
        fillStyle: 'solid',
        roughness: 0.9,
        seed: seed + 6 + i,
      });
      rc.circle(ex - 3, cy - 8, 5, {
        stroke: '#ffffff',
        strokeWidth: 1.4,
        fill: '#ffffff',
        fillStyle: 'solid',
        roughness: 0.6,
        seed: seed + 8 + i,
      });
    }
  });
  rc.ellipse(cx - 33, cy + 9, 10, 5, {
    stroke: RED,
    strokeWidth: 1.5,
    fill: '#FFD3D3',
    fillStyle: 'solid',
    roughness: 0.8,
    seed: seed + 10,
  });
  rc.ellipse(cx + 13, cy + 9, 10, 5, {
    stroke: RED,
    strokeWidth: 1.5,
    fill: '#FFD3D3',
    fillStyle: 'solid',
    roughness: 0.8,
    seed: seed + 11,
  });
  rc.path(
    `M ${cx - 15} ${cy + 15} Q ${cx - 10} ${cy + 21} ${cx - 5} ${cy + 15}`,
    {
      stroke: INK,
      strokeWidth: 2,
      roughness: 0.9,
      seed: seed + 12,
    }
  );
  // twinkling sparkle in the screen corner
  const tw = 0.6 + (Math.sin(t / 600 + 1.1) * 0.5 + 0.5) * 0.5;
  ctx.translate(cx + 18, cy - 20);
  ctx.scale(tw, tw);
  rc.line(0, -6, 0, 6, {
    stroke: LILAC,
    strokeWidth: 2,
    roughness: 1,
    seed: seed + 13,
  });
  rc.line(-6, 0, 6, 0, {
    stroke: LILAC,
    strokeWidth: 2,
    roughness: 1,
    seed: seed + 14,
  });

  ctx.restore();
};

const ghost = ({ rc, ctx, seed }: Scene, t: number, bx = 448, by = 262) => {
  const x = bx + Math.sin(t / 900 + 0.4) * 6;
  const y = by + Math.sin(t / 1300 + 2.1) * 5;

  ctx.save();
  ctx.translate(x, y);

  rc.path(
    'M -20 14 L -20 -4 Q -20 -26 0 -26 Q 20 -26 20 -4 L 20 14 ' +
      'L 12 7 L 4 14 L -4 7 L -12 14 Z',
    {
      stroke: INK,
      strokeWidth: 2.4,
      fill: '#E3F2FD',
      fillStyle: 'solid',
      roughness: 1.2,
      seed,
    }
  );
  rc.circle(-7, -8, 5, {
    stroke: INK,
    strokeWidth: 2,
    fill: INK,
    fillStyle: 'solid',
    roughness: 0.8,
    seed: seed + 1,
  });
  rc.circle(6, -8, 5, {
    stroke: INK,
    strokeWidth: 2,
    fill: INK,
    fillStyle: 'solid',
    roughness: 0.8,
    seed: seed + 2,
  });

  ctx.restore();
};

const spark = (
  { rc, ctx, seed }: Scene,
  t: number,
  x: number,
  y: number,
  size: number,
  color: string,
  phase: number
) => {
  const s = 0.7 + (Math.sin(t / 700 + phase) * 0.5 + 0.5) * 0.55;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  const opts = { stroke: color, strokeWidth: 2.4, roughness: 1.1 };
  rc.line(0, -size, 0, size, { ...opts, seed });
  rc.line(-size * 0.85, -size * 0.45, size * 0.85, size * 0.45, {
    ...opts,
    seed: seed + 1,
  });
  rc.line(size * 0.85, -size * 0.45, -size * 0.85, size * 0.45, {
    ...opts,
    seed: seed + 2,
  });

  ctx.restore();
};

type SceneDef = {
  width: number;
  height: number;
  draw: (scene: Scene, t: number) => void;
};

// music + anime float above the hero copy...
const drawTop = (scene: Scene, t: number) => {
  equalizer(scene, t, 70, 172);
  musicNote(scene, t, 148, 106, 20, BLUE, 0);
  musicNote(scene, t, 202, 62, 14, AMBER, 1.8);
  animeTv(scene, t, 650, 112);
  spark(scene, t, 372, 74, 8, GREEN, 1.4);
  spark(scene, t, 458, 140, 7, RED, 0.3);
};

// ...the games live below it
const drawBottom = (scene: Scene, t: number) => {
  controller(scene, t, 155, 130);
  ghost(scene, t, 462, 118);
  spark(scene, t, 46, 60, 9, RED, 0.3);
  spark(scene, t, 320, 170, 7, LILAC, 2.6);
};

const SCENES: Record<string, SceneDef> = {
  top: { width: 760, height: 190, draw: drawTop },
  bottom: { width: 520, height: 230, draw: drawBottom },
};

const fitCanvas = (
  canvas: HTMLCanvasElement,
  def: SceneDef
): CanvasRenderingContext2D => {
  const cssWidth = canvas.getBoundingClientRect().width || def.width;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const scale = (cssWidth / def.width) * dpr;
  canvas.width = Math.round(def.width * scale);
  canvas.height = Math.round(def.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  return ctx;
};

const bootCanvas = (canvas: HTMLCanvasElement) => {
  const def = SCENES[canvas.dataset.heroMotion || ''];
  if (!def) return;

  const rc = rough.canvas(canvas);
  const scene: Scene = { rc, ctx: fitCanvas(canvas, def), seed: 11 };
  const baseSeed = scene.seed;

  const drawScene = (t: number) => {
    scene.ctx.clearRect(0, 0, def.width, def.height);
    def.draw(scene, t);
  };

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) {
    drawScene(0);
    new ResizeObserver(() => {
      scene.ctx = fitCanvas(canvas, def);
      drawScene(0);
    }).observe(canvas);
    return;
  }

  let raf = 0;
  let last = 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - last < FRAME_MS) return;
    last = now;
    scene.seed = baseSeed + (Math.floor(now / BOIL_MS) % 3);
    drawScene(now);
  };

  const start = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  // don't burn frames while the hero is scrolled away
  new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) start();
    else stop();
  }).observe(canvas);

  new ResizeObserver(() => {
    scene.ctx = fitCanvas(canvas, def);
    drawScene(last || 0);
  }).observe(canvas);

  start();
};

const boot = () => {
  document
    .querySelectorAll<HTMLCanvasElement>('canvas[data-hero-motion]')
    .forEach(bootCanvas);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
