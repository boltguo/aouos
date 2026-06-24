import { drawBlogSketch, drawDivider, drawFrame } from './sketches/blog';
import { drawProjectSketch } from './sketches/projects';

const drawSketch = (canvas: HTMLCanvasElement) => {
  switch (canvas.dataset.sketch) {
    case 'project':
      drawProjectSketch(canvas);
      break;
    case 'blog':
      drawBlogSketch(canvas);
      break;
    case 'divider':
      drawDivider(canvas);
      break;
    default:
      break;
  }
};

let resizeObserver: ResizeObserver | null = null;
let redrawTimer = 0;

const drawAll = () => {
  document
    .querySelectorAll<HTMLCanvasElement>('canvas[data-sketch]')
    .forEach(drawSketch);
  document
    .querySelectorAll<HTMLCanvasElement>('canvas[data-rough-frame]')
    .forEach(drawFrame);
};

const scheduleDraw = () => {
  window.clearTimeout(redrawTimer);
  redrawTimer = window.setTimeout(drawAll, 80);
};

const boot = async () => {
  await document.fonts?.ready.catch(() => undefined);
  drawAll();

  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(scheduleDraw);
  const observed = new Set<Element>();
  document
    .querySelectorAll<HTMLCanvasElement>(
      'canvas[data-rough-frame], canvas[data-sketch]'
    )
    .forEach((canvas) => {
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
