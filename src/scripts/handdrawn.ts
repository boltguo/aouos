import { animateSketch, renderSketch, type DrawEnv } from './sketches/core';
import { drawProjectSketch } from './sketches/projects';

const buildSketch = (canvas: HTMLCanvasElement): DrawEnv | null => {
  switch (canvas.dataset.sketch) {
    case 'project':
      return drawProjectSketch(canvas);
    default:
      return null;
  }
};

const sketchCanvases = () =>
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-sketch]');

const revealed = new WeakSet<HTMLCanvasElement>();
const running = new WeakMap<HTMLCanvasElement, () => void>();

const prefersStill = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const inViewport = (el: Element) => {
  const r = el.getBoundingClientRect();
  return (
    r.top < window.innerHeight &&
    r.bottom > 0 &&
    r.left < window.innerWidth &&
    r.right > 0
  );
};

const renderCanvas = (canvas: HTMLCanvasElement, animate: boolean) => {
  running.get(canvas)?.();
  running.delete(canvas);
  const env = buildSketch(canvas);
  if (!env) return;
  if (animate && !prefersStill()) {
    running.set(canvas, animateSketch(env));
  } else {
    renderSketch(env);
  }
};

let resizeObserver: ResizeObserver | null = null;
let revealObserver: IntersectionObserver | null = null;
let redrawTimer = 0;

const redrawRevealed = () => {
  sketchCanvases().forEach((canvas) => {
    if (revealed.has(canvas)) renderCanvas(canvas, false);
  });
};

const scheduleDraw = () => {
  window.clearTimeout(redrawTimer);
  redrawTimer = window.setTimeout(redrawRevealed, 80);
};

const boot = async () => {
  await document.fonts?.ready.catch(() => undefined);

  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const canvas = entry.target as HTMLCanvasElement;
        revealObserver?.unobserve(canvas);
        revealed.add(canvas);
        renderCanvas(canvas, true);
      });
    },
    { threshold: 0.25 }
  );

  resizeObserver?.disconnect();
  // ResizeObserver fires once on observe(); only redraw on real size changes
  // so the initial notification can't cancel a reveal animation in flight.
  const lastSize = new WeakMap<Element, string>();
  resizeObserver = new ResizeObserver((entries) => {
    let changed = false;
    entries.forEach((entry) => {
      const size = `${Math.round(entry.contentRect.width)}x${Math.round(entry.contentRect.height)}`;
      if (lastSize.get(entry.target) !== size) {
        if (lastSize.has(entry.target)) changed = true;
        lastSize.set(entry.target, size);
      }
    });
    if (changed) scheduleDraw();
  });
  const observed = new Set<Element>();
  sketchCanvases().forEach((canvas) => {
    // canvases already on screen animate right away; the rest wait for scroll
    if (!revealed.has(canvas) && inViewport(canvas)) {
      revealed.add(canvas);
      renderCanvas(canvas, true);
    } else if (!revealed.has(canvas)) {
      revealObserver?.observe(canvas);
    }
    const parent = canvas.parentElement;
    if (parent && !observed.has(parent)) {
      observed.add(parent);
      resizeObserver?.observe(parent);
    }
  });

  window.removeEventListener('resize', scheduleDraw);
  window.addEventListener('resize', scheduleDraw, { passive: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  void boot();
}
