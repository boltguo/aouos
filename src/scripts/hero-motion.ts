import rough from 'roughjs';
import type { RoughCanvas } from 'roughjs/bin/canvas';

const INK = '#4a4138';
const BLUE = '#1e88e5';
const GREEN = '#43a047';
const RED = '#e88d8d';
const AMBER = '#ffb74d';
const PASTEL_GREEN = '#bff1c8';
const PASTEL_RED = '#ffc2bd';
const PASTEL_LILAC = '#d2cdff';

// redraw ~11fps so the wobble reads as a hand-drawn "boil", not smooth motion
const FRAME_MS = 88;
const BOIL_MS = 240;

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
  cy = 216,
  scale = 1
) => {
  const sway = Math.sin(t / 1400) * 0.05;
  const bob = Math.sin(t / 1400 + 1.2) * 4;

  ctx.save();
  ctx.translate(cx, cy + bob);
  ctx.rotate(sway);
  ctx.scale(scale, scale);
  ctx.translate(-250, -216);

  rc.path(
    'M 184 166 Q 166 166 160 185 L 150 236 Q 145 256 158 267 ' +
      'Q 171 278 183 260 L 198 238 Q 204 230 216 230 L 284 230 ' +
      'Q 296 230 302 238 L 317 260 Q 329 278 342 267 Q 355 256 350 236 ' +
      'L 340 185 Q 334 166 316 166 Z',
    {
      stroke: INK,
      strokeWidth: 2.8,
      fill: '#ffffff',
      fillStyle: 'solid',
      roughness: 1.3,
      seed,
    }
  );
  // shoulder seams
  rc.line(184, 173, 201, 184, {
    stroke: INK,
    strokeWidth: 2,
    roughness: 1,
    seed: seed + 1,
  });
  rc.line(316, 173, 299, 184, {
    stroke: INK,
    strokeWidth: 2,
    roughness: 1,
    seed: seed + 2,
  });
  // d-pad
  rc.line(192, 202, 224, 202, {
    stroke: INK,
    strokeWidth: 5,
    roughness: 1,
    seed: seed + 3,
  });
  rc.line(208, 186, 208, 218, {
    stroke: INK,
    strokeWidth: 5,
    roughness: 1,
    seed: seed + 4,
  });
  // four face buttons
  [
    [312, 191, BLUE, '#E3F2FD'],
    [326, 205, RED, '#FFDDDD'],
    [312, 219, GREEN, '#E4F5E5'],
    [298, 205, AMBER, '#FFF1D7'],
  ].forEach(([x, y, color, fill], i) => {
    rc.circle(x as number, y as number, 11, {
      stroke: color as string,
      strokeWidth: 2.1,
      fill: fill as string,
      fillStyle: 'solid',
      roughness: 1,
      seed: seed + 5 + i,
    });
  });
  // thumb sticks and a small home button
  rc.circle(241, 207, 16, {
    stroke: INK,
    strokeWidth: 2.2,
    fill: '#f4f1ed',
    fillStyle: 'solid',
    roughness: 1,
    seed: seed + 9,
  });
  rc.circle(276, 207, 16, {
    stroke: INK,
    strokeWidth: 2.2,
    fill: '#f4f1ed',
    fillStyle: 'solid',
    roughness: 1,
    seed: seed + 10,
  });
  rc.circle(258, 190, 7, {
    stroke: INK,
    strokeWidth: 1.8,
    fill: '#ffffff',
    fillStyle: 'solid',
    roughness: 0.8,
    seed: seed + 11,
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

const floatingRing = (
  { rc, ctx, seed }: Scene,
  t: number,
  x: number,
  y: number,
  size: number,
  color: string,
  phase: number,
  filled = false
) => {
  const s = 0.86 + Math.sin(t / 900 + phase) * 0.08;
  const bob = Math.sin(t / 1300 + phase) * 2.5;

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(s, s);

  const options = {
    stroke: color,
    strokeWidth: 2.2,
    roughness: 1.15,
    seed,
  };

  if (filled) {
    rc.circle(0, 0, size * 2, {
      ...options,
      fill: color,
      fillStyle: 'solid',
    });
  } else {
    rc.circle(0, 0, size * 2, options);
  }

  ctx.restore();
};

const floatingCurve = (
  { rc, ctx, seed }: Scene,
  t: number,
  x: number,
  y: number,
  size: number,
  color: string,
  phase: number,
  doubled = false
) => {
  const bob = Math.sin(t / 1250 + phase) * 2.5;
  const tilt = Math.sin(t / 1700 + phase) * 0.08;

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(tilt);

  const options = {
    stroke: color,
    strokeWidth: 2.3,
    roughness: 1.15,
    seed,
  };
  rc.path(`M ${-size} 0 Q 0 ${size * 0.58} ${size} 1`, options);
  if (doubled) {
    rc.path(`M ${-size + 1} 3 Q 0 ${size * 0.72} ${size - 1} 4`, {
      ...options,
      strokeWidth: 1.7,
      seed: seed + 1,
    });
  }

  ctx.restore();
};

type SceneDef = {
  width: number;
  height: number;
  draw: (scene: Scene, t: number) => void;
};

// Music floats opposite the SVG character portraits above the hero copy.
const drawTop = (scene: Scene, t: number) => {
  equalizer(scene, t, 70, 172);
  musicNote(scene, t, 148, 106, 20, BLUE, 0);
  musicNote(scene, t, 202, 62, 14, AMBER, 1.8);
  floatingRing(scene, t, 372, 74, 5, PASTEL_GREEN, 1.4, true);
  floatingCurve(scene, t, 458, 140, 13, PASTEL_RED, 0.3);
};

// Anya sits at left; the controller cable reaches back toward the center.
const drawBottom = (scene: Scene, t: number) => {
  const cableWave = Math.sin(t / 1500) * 3;
  scene.rc.path(
    `M 654 ${88 + cableWave} C 644 ${132 + cableWave}, 612 ${174 - cableWave}, 570 181 ` +
      `C 526 189, 493 ${145 + cableWave}, 446 145 ` +
      `C 398 145, 358 ${195 - cableWave}, 294 218`,
    {
      stroke: INK,
      strokeWidth: 2.4,
      roughness: 1.2,
      seed: scene.seed + 15,
    }
  );
  controller(scene, t, 670, 86, 0.76);
  floatingRing(scene, t, 272, 186, 5, PASTEL_RED, 0.3);
  floatingCurve(scene, t, 452, 166, 14, PASTEL_LILAC, 2.6, true);
};

const SCENES: Record<string, SceneDef> = {
  top: { width: 760, height: 190, draw: drawTop },
  bottom: { width: 760, height: 230, draw: drawBottom },
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
