import type { Action } from 'svelte/action';
import { bwv1052 } from './bwv1052';
import {
	createGridRenderer,
	TRAVEL,
	type Box,
	type GridRenderer,
	type GridView
} from './gridShader';

type Surface = {
	element: HTMLElement;
	canvas: HTMLCanvasElement;
	render: GridRenderer;
};

type Contact = { centre: number; halfWidth: number };

type Moment = Pick<GridView, 'time' | 'viewport'>;

type Scene = Omit<GridView, 'origin' | 'resolution' | 'scale'>;

const RECEIVE_REACH = 16;
const MAX_PIXEL_RATIO = 2;
const ENERGY_RATE = 3;
const POINTER_RATE = 6;

const patches = new Set<HTMLElement>();
const pointer = { x: 0, y: 0, over: false, presence: 0 };
let field: Surface | null = null;
let receiver: Surface | null = null;
let contact: Contact = { centre: 0, halfWidth: 0 };
let energy = 0;
let previousTime = 0;
let startTime: number | null = null;
let leadIn: number | null = null;
let frame = 0;

/** Lights up the notes falling past this element, as far as its .graph-paper grid reaches. */
export const gridSignals: Action<HTMLElement> = (element) => {
	patches.add(element);
	return {
		destroy() {
			patches.delete(element);
		}
	};
};

/** Draws the falling notes across the whole viewport. */
export const gridField: Action<HTMLElement> = (element) => {
	const surface = createSurface(element, 'block h-full w-full');
	if (!surface) return;
	field = surface;
	addEventListener('pointermove', follow, { passive: true });
	addEventListener('mouseout', leave);
	start();
	return {
		destroy() {
			field = null;
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
	const render = gl && createGridRenderer(gl, bwv1052);
	if (!render) return null;
	element.append(canvas);
	return { element, canvas, render };
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
	const viewport: Moment['viewport'] = [
		document.documentElement.clientWidth,
		document.documentElement.clientHeight
	];
	// Start the song a screen's fall early so the first notes drop in from the top.
	leadIn ??= viewport[1] / TRAVEL;
	const moment: Moment = { time: now / 1000 - (startTime ?? now / 1000) - leadIn, viewport };
	const elapsed = moment.time - previousTime;
	previousTime = moment.time;
	if (field) drawField(field, moment, elapsed);
	if (receiver) drawReceiver(receiver, moment, elapsed);
	frame = requestAnimationFrame(tick);
}

function drawField(surface: Surface, moment: Moment, elapsed: number) {
	pointer.presence = approach(pointer.presence, pointer.over ? 1 : 0, elapsed, POINTER_RATE);
	const [width, height] = moment.viewport;
	const lit: Box[] = [];
	for (const element of patches) {
		const rect = element.getBoundingClientRect();
		// The grid drawn by .graph-paper reaches past the element by its bleed.
		const bleed = -parseFloat(getComputedStyle(element, '::before').top) || 0;
		const box: Box = [rect.left - bleed, rect.top - bleed, rect.right + bleed, rect.bottom + bleed];
		if (box[2] > 0 && box[0] < width && box[3] > 0 && box[1] < height) lit.push(box);
	}
	draw(surface, {
		...moment,
		mode: 'field',
		contact: [0, 0, 0],
		lit,
		pointer: [pointer.x, pointer.y, pointer.presence]
	});
}

function drawReceiver(surface: Surface, moment: Moment, elapsed: number) {
	const touching = findContact(surface.element.getBoundingClientRect());
	if (touching) contact = touching;
	energy = approach(energy, touching ? 1 : 0, elapsed, ENERGY_RATE);
	draw(surface, {
		...moment,
		mode: 'receiver',
		contact: [contact.centre, contact.halfWidth, energy],
		lit: [],
		pointer: [0, 0, 0]
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

function approach(value: number, target: number, elapsed: number, rate: number): number {
	return value + (target - value) * (1 - Math.exp(-Math.max(elapsed, 0) * rate));
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
