import type { Action } from 'svelte/action';
import { createGridRenderer, type GridRenderer, type GridView } from './gridShader';

type Surface = {
	element: HTMLElement;
	canvas: HTMLCanvasElement;
	render: GridRenderer;
	visible: boolean;
};

type Contact = { centre: number; halfWidth: number };

type Moment = Pick<GridView, 'time' | 'activity'>;

type Scene = Moment & Pick<GridView, 'receiver' | 'contact'>;

const RECEIVE_REACH = 16;
const MAX_PIXEL_RATIO = 2;
const ENERGY_RATE = 3;
const QUIET_SECONDS = 3;
const RAMP_SECONDS = 7;

const patches = new Set<Surface>();
let receiver: Surface | null = null;
let contact: Contact = { centre: 0, halfWidth: 0 };
let energy = 0;
let previousTime = 0;
let startTime: number | null = null;
let frame = 0;

export const gridSignals: Action<HTMLElement> = (element) => {
	const patch = createSurface(element, 'graph-signals');
	if (!patch) return;
	patches.add(patch);
	const visibility = new IntersectionObserver(([entry]) => {
		patch.visible = entry.isIntersecting;
	});
	visibility.observe(patch.canvas);
	start();
	return {
		destroy() {
			visibility.disconnect();
			patches.delete(patch);
			patch.canvas.remove();
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
	return { element, canvas, render, visible: true };
}

function start() {
	startTime ??= performance.now() / 1000;
	if (!frame) frame = requestAnimationFrame(tick);
}

function stopWhenIdle() {
	if (patches.size > 0 || receiver) return;
	cancelAnimationFrame(frame);
	frame = 0;
}

function tick(now: number) {
	const time = now / 1000;
	const moment: Moment = { time, activity: activityAt(time) };
	for (const patch of patches) {
		if (patch.visible) draw(patch, { ...moment, receiver: false, contact: [0, 0, 0] });
	}
	if (receiver) drawReceiver(receiver, moment);
	frame = requestAnimationFrame(tick);
}

function drawReceiver(surface: Surface, moment: Moment) {
	const touching = findContact(surface.element.getBoundingClientRect());
	if (touching) contact = touching;
	energy = approach(energy, touching ? 1 : 0, moment.time - previousTime);
	previousTime = moment.time;
	draw(surface, {
		...moment,
		receiver: true,
		contact: [contact.centre, contact.halfWidth, energy]
	});
}

function findContact(header: DOMRect): Contact | null {
	let closest: Contact | null = null;
	let widest = 0;
	for (const patch of patches) {
		const lit = patch.element.getBoundingClientRect();
		const overlap = Math.min(lit.right, header.right) - Math.max(lit.left, header.left);
		const touching = lit.top - RECEIVE_REACH < header.bottom && lit.bottom > header.top;
		if (!touching || overlap <= widest) continue;
		widest = overlap;
		closest = { centre: (lit.left + lit.right) / 2, halfWidth: lit.width * 0.35 };
	}
	return closest;
}

function approach(value: number, target: number, elapsed: number): number {
	return value + (target - value) * (1 - Math.exp(-Math.max(elapsed, 0) * ENERGY_RATE));
}

function activityAt(time: number): number {
	const elapsed = time - (startTime ?? time) - QUIET_SECONDS;
	const progress = Math.min(Math.max(elapsed / RAMP_SECONDS, 0), 1);
	return progress * progress * (3 - 2 * progress);
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
