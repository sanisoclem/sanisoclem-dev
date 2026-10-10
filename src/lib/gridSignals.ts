import type { Action } from 'svelte/action';
import {
  BLENDS,
  createGridRenderer,
  type Blend,
  type Box,
  type GridRenderer,
  type GridView,
  type Photo
} from './gridShader';

type Surface = {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  render: GridRenderer;
};

type Contact = { centre: number; halfWidth: number };

type PhotoSection = { element: HTMLElement; image: HTMLImageElement };

type Point = [x: number, y: number];

type Viewport = GridView['viewport'];

type Wave = {
  origin: Point;
  strength: number;
  start: number;
  enterRadius: number;
  exitRadius: number;
};

type Moment = Pick<GridView, 'time' | 'activity' | 'viewport' | 'wave' | 'blend'>;

type Scene = Omit<GridView, 'origin' | 'resolution' | 'scale'>;

const RECEIVE_REACH = 16;
const MAX_PIXEL_RATIO = 2;
const ENERGY_RATE = 3;
const POINTER_RATE = 6;
const QUIET_SECONDS = 3;
const RAMP_SECONDS = 7;
const FIRST_WAVE_SECONDS = 1.5;
const WAVE_SPEED = 200;
const WAVE_MARGIN = 40;
const WAVE_BEAT_SECONDS = 60;
const WAVE_STRENGTH = [0.55, 1];
const WAVE_ORIGIN = [3, 6];
const WAVE_FADE_IN = 0.35;
const WAVE_FADE_OUT = 0.55;
const NO_WAVE: GridView['wave'] = [0, 0, -1e5, 0];
const DEFAULT_BLEND: Blend = 'screen';
const LIVE_CLASS = 'grid-live';

const patches = new Set<HTMLElement>();
const pointer = { x: 0, y: 0, over: false, presence: 0 };
let photoSection: PhotoSection | null = null;
let field: Surface | null = null;
let receiver: Surface | null = null;
let contact: Contact = { centre: 0, halfWidth: 0 };
let energy = 0;
let currentWave: Wave | null = null;
let nextWave = FIRST_WAVE_SECONDS;
let blend: Blend = DEFAULT_BLEND;
let previousTime = 0;
let startTime: number | null = null;
let frame = 0;

export const gridSignals: Action<HTMLElement> = (element) => {
  patches.add(element);
  return {
    destroy() {
      patches.delete(element);
    }
  };
};

export const gridPhoto: Action<HTMLElement, string> = (element, url) => {
  const image = new Image();
  image.src = url;
  photoSection = { element, image };
  return {
    destroy() {
      photoSection = null;
    }
  };
};

export const gridField: Action<HTMLElement> = (element) => {
  const surface = createSurface(element, 'block h-full w-full');
  if (!surface) return;
  field = surface;
  blend = requestedBlend();
  document.documentElement.classList.add(LIVE_CLASS);
  addEventListener('pointermove', follow, { passive: true });
  addEventListener('mouseout', leave);
  start();
  return {
    destroy() {
      field = null;
      document.documentElement.classList.remove(LIVE_CLASS);
      removeEventListener('pointermove', follow);
      removeEventListener('mouseout', leave);
      surface.canvas.remove();
      stopWhenIdle();
    }
  };
};

export const gridReceiver: Action<HTMLElement> = (element) => {
  const surface = createSurface(
    element,
    'pointer-events-none absolute top-0 left-0 -z-10 h-[calc(100%+1px)] w-full'
  );
  if (!surface) return;
  receiver = surface;
  start();
  return {
    destroy() {
      receiver = null;
      surface.canvas.remove();
      stopWhenIdle();
    }
  };
};

function createSurface(element: HTMLElement, className: string): Surface | null {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const canvas = document.createElement('canvas');
  canvas.className = className;
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false });
  const render = gl && createGridRenderer(gl);
  if (!render) return null;
  element.append(canvas);
  return { element, canvas, render };
}

function requestedBlend(): Blend {
  const requested = new URLSearchParams(location.search).get('blend');
  return BLENDS.find((name) => name === requested) ?? DEFAULT_BLEND;
}

function follow(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return;
  Object.assign(pointer, { x: event.clientX, y: event.clientY, over: true });
}

function leave(event: MouseEvent) {
  if (!event.relatedTarget) pointer.over = false;
}

function start() {
  startTime ??= performance.now() / 1000;
  if (!frame) frame = requestAnimationFrame(tick);
}

function stopWhenIdle() {
  if (field || receiver) return;
  cancelAnimationFrame(frame);
  frame = 0;
}

function tick(now: number) {
  const time = now / 1000 - (startTime ?? now / 1000);
  const viewport = viewportSize();
  const moment: Moment = {
    time,
    viewport,
    activity: activityAt(time),
    wave: waveAt(time, viewport),
    blend
  };
  const elapsed = time - previousTime;
  previousTime = time;
  if (field) drawField(field, moment, elapsed);
  if (receiver) drawReceiver(receiver, moment, elapsed);
  frame = requestAnimationFrame(tick);
}

function viewportSize(): Viewport {
  return [document.documentElement.clientWidth, document.documentElement.clientHeight];
}

function drawField(surface: Surface, moment: Moment, elapsed: number) {
  pointer.presence = approach(pointer.presence, pointer.over ? 1 : 0, elapsed, POINTER_RATE);
  draw(surface, {
    ...moment,
    mode: 'field',
    contact: [0, 0, 0],
    islands: visibleIslands(moment.viewport),
    pointer: [pointer.x, pointer.y, pointer.presence],
    photo: visiblePhoto(moment.viewport)
  });
}

function visiblePhoto(viewport: Viewport): Photo | null {
  if (!photoSection || !isLoaded(photoSection.image)) return null;
  const box = elementBox(photoSection.element);
  return overlapsViewport(box, viewport) ? { image: photoSection.image, box } : null;
}

function isLoaded(image: HTMLImageElement): boolean {
  return image.complete && image.naturalWidth > 0;
}

function elementBox(element: HTMLElement): Box {
  const { left, top, right, bottom } = element.getBoundingClientRect();
  return [left, top, right, bottom];
}

function visibleIslands(viewport: Viewport): Box[] {
  return [...patches].map(islandBox).filter((box) => overlapsViewport(box, viewport));
}

function overlapsViewport([left, top, right, bottom]: Box, [width, height]: Viewport): boolean {
  return right > 0 && left < width && bottom > 0 && top < height;
}

function islandBox(patch: HTMLElement): Box {
  const [left, top, right, bottom] = elementBox(patch);
  const bleed = paperBleed(patch);
  return [left - bleed, top - bleed, right + bleed, bottom + bleed];
}

function paperBleed(patch: HTMLElement): number {
  return -parseFloat(getComputedStyle(patch, '::before').top) || 0;
}

function drawReceiver(surface: Surface, moment: Moment, elapsed: number) {
  const touching = findContact(surface.element.getBoundingClientRect());
  if (touching) contact = touching;
  energy = approach(energy, touching ? 1 : 0, elapsed, ENERGY_RATE);
  draw(surface, {
    ...moment,
    mode: 'receiver',
    contact: [contact.centre, contact.halfWidth, energy],
    islands: [],
    pointer: [0, 0, 0],
    photo: null
  });
}

function findContact(header: DOMRect): Contact | null {
  let closest: Contact | null = null;
  let widest = 0;
  for (const patch of patches) {
    const lit = patch.getBoundingClientRect();
    const overlap = Math.min(lit.right, header.right) - Math.max(lit.left, header.left);
    const touching = lit.top - RECEIVE_REACH < header.bottom && lit.bottom > header.top;
    if (!touching || overlap <= widest) continue;
    widest = overlap;
    closest = { centre: (lit.left + lit.right) / 2, halfWidth: lit.width * 0.35 };
  }
  return closest;
}

function waveAt(time: number, viewport: Viewport): GridView['wave'] {
  updateWave(time, viewport);
  if (!currentWave) return NO_WAVE;
  const radius = waveRadius(currentWave, time);
  return [...currentWave.origin, radius, currentWave.strength * waveFade(currentWave, radius)];
}

function updateWave(time: number, viewport: Viewport) {
  if (currentWave && waveRadius(currentWave, time) > currentWave.exitRadius) currentWave = null;
  if (currentWave || time < nextWave) return;
  currentWave = createWave(time, viewport);
  nextWave = time + WAVE_BEAT_SECONDS;
}

function waveRadius(wave: Wave, time: number): number {
  return wave.enterRadius - WAVE_MARGIN + (time - wave.start) * WAVE_SPEED;
}

function waveFade(wave: Wave, radius: number): number {
  const progress = (radius - wave.enterRadius) / (wave.exitRadius - wave.enterRadius);
  return smoothstep(progress / WAVE_FADE_IN) * smoothstep((1 - progress) / WAVE_FADE_OUT);
}

function createWave(start: number, viewport: Viewport): Wave {
  const origin = randomOrigin(viewport);
  return {
    origin,
    strength: between(WAVE_STRENGTH),
    start,
    enterRadius: distanceToViewport(origin, viewport),
    exitRadius: distanceToFarthestCorner(origin, viewport)
  };
}

function randomOrigin([width, height]: Viewport): Point {
  const angle = Math.random() * 2 * Math.PI;
  const distance = (Math.hypot(width, height) / 2) * between(WAVE_ORIGIN);
  return [width / 2 - Math.cos(angle) * distance, height / 2 - Math.sin(angle) * distance];
}

function distanceToViewport([x, y]: Point, [width, height]: Viewport): number {
  return Math.hypot(
    Math.max(Math.abs(x - width / 2) - width / 2, 0),
    Math.max(Math.abs(y - height / 2) - height / 2, 0)
  );
}

function distanceToFarthestCorner([x, y]: Point, [width, height]: Viewport): number {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
}

function between([low, high]: number[]): number {
  return low + Math.random() * (high - low);
}

function smoothstep(value: number): number {
  const clamped = Math.min(Math.max(value, 0), 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function approach(value: number, target: number, elapsed: number, rate: number): number {
  return value + (target - value) * (1 - Math.exp(-Math.max(elapsed, 0) * rate));
}

function activityAt(time: number): number {
  return smoothstep((time - QUIET_SECONDS) / RAMP_SECONDS);
}

function draw(surface: Surface, scene: Scene) {
  const rect = surface.canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  fitCanvas(surface.canvas, rect);
  surface.render({
    ...scene,
    origin: [rect.left, rect.top],
    resolution: [surface.canvas.width, surface.canvas.height],
    scale: surface.canvas.width / rect.width
  });
}

function fitCanvas(canvas: HTMLCanvasElement, rect: DOMRect) {
  const ratio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO);
  const width = Math.round(rect.width * ratio);
  const height = Math.round(rect.height * ratio);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
}
