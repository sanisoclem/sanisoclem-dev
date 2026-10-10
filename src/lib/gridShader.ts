import { onsetKeys, rollTexture, stepsPerSecond, type PianoRoll } from './pianoRoll';

export type GridMode = 'field' | 'receiver';

export type Box = [left: number, top: number, right: number, bottom: number];

export type GridView = {
	origin: [number, number];
	resolution: [number, number];
	scale: number;
	viewport: [number, number];
	time: number;
	mode: GridMode;
	contact: [centre: number, halfWidth: number, energy: number];
	/** Where the grid is lit around content, in viewport pixels. */
	lit: readonly Box[];
	pointer: [x: number, y: number, presence: number];
};

export type GridRenderer = (view: GridView) => void;

/** How fast notes fall, in CSS pixels per second. */
export const TRAVEL = 140;

const MODES: Record<GridMode, number> = { field: 0, receiver: 1 };
const MAX_IMPACTS = 48;
const MAX_LIT = 8;
const FLASH_SECONDS = 1.5;

const VERTEX = `#version 300 es
void main() {
	vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
	gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D u_roll;
uniform int u_keys;
uniform int u_steps;
uniform vec2 u_origin;
uniform vec2 u_resolution;
uniform float u_scale;
uniform vec2 u_viewport;
uniform float u_time;
uniform float u_stepRate;
uniform int u_mode;
uniform vec3 u_contact;
uniform vec2 u_impacts[${MAX_IMPACTS}];
uniform int u_impactCount;
uniform vec4 u_lit[${MAX_LIT}];
uniform int u_litCount;
uniform vec3 u_pointer;

out vec4 outColor;

const int RECEIVER = ${MODES.receiver};
const float CELL = 32.0;
const float TRAVEL = ${TRAVEL.toFixed(1)};
const float TAIL_EXTRA = 5.0;
const float UNLIT_HEAD = 0.3;
const float ARRIVAL = 240.0;
const float SPREAD = 700.0;
const float FADE = 0.25;
const float REACH = 200.0;
const vec3 AMBER = vec3(0.996, 0.604, 0.0);
const vec3 HOT = vec3(1.0, 0.86, 0.6);

float lineCore(float gap) {
	return 1.0 - smoothstep(0.0, 1.0, gap);
}

float lineGlow(float gap) {
	return lineCore(gap) + 0.35 * exp(-gap * gap / 6.0);
}

float hash(vec2 p) {
	vec3 p3 = fract(p.xyx * 0.1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
		mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
		f.y
	);
}

float firstKeyColumn() {
	return floor(u_viewport.x / CELL * 0.5) - floor(float(u_keys) * 0.5);
}

float keyX(float key) {
	return (firstKeyColumn() + key) * CELL + 0.5;
}

// The last grid line before the bottom of the viewport, where notes land.
float hitLine() {
	return floor((u_viewport.y - 2.5) / CELL) * CELL + 0.5;
}

// Steps since the key's last onset (0 before its first) and that note's length.
vec2 rollAt(int key, int step) {
	int rows = textureSize(u_roll, 0).y;
	int wrapped = step % u_steps;
	ivec2 texel = ivec2((wrapped / rows) * u_keys + key, wrapped % rows);
	return floor(texelFetch(u_roll, texel, 0).rg * 255.0 + 0.5);
}

// A compact spark: tight across the line, slightly drawn out along it.
float head(vec2 offset) {
	return 2.4 * exp(-offset.x * offset.x / 1.2 - offset.y * offset.y / 6.0) +
		0.3 * exp(-dot(offset, offset) / 12.0);
}

// A falling star per note as (head, tail): a spark where the note starts, and a tail that lasts
// as long as the note, flickering and drifting more the further it trails.
vec2 star(vec2 p, float column) {
	int key = int(column - firstKeyColumn());
	float hit = hitLine();
	float played = u_time + (hit - p.y) / TRAVEL;
	if (key < 0 || key >= u_keys || played < 0.0 || p.y > hit + 1.0) return vec2(0.0);
	float step = played * u_stepRate;
	int index = int(step);
	float stepHeight = TRAVEL / u_stepRate;
	float dx = p.x - column * CELL - 0.5;
	vec2 light = vec2(0.0);

	vec2 here = rollAt(key, index);
	float since = here.x - 1.0 + fract(step);
	float progress = since / (here.y + TAIL_EXTRA);
	if (here.x > 0.0 && progress < 1.0) {
		float behind = since * stepHeight;
		vec2 seed = vec2(float(key) * 7.0, float(index) - here.x);
		float flicker = noise(vec2(behind / 3.0, u_time * 9.0) + seed);
		float drift = (noise(vec2(behind / 6.0, u_time * 3.0) - seed) - 0.5) * 3.0 * progress;
		float tail = pow(1.0 - progress, 1.6) * mix(1.0, 1.6 * flicker * flicker, sqrt(progress));
		light += vec2(head(vec2(dx, behind)), 1.1 * tail * lineGlow(abs(dx - drift)));
	}
	if (rollAt(key, index + 1).x == 1.0) {
		light.x += head(vec2(dx, (float(index + 1) - step) * stepHeight));
	}
	return light;
}

// Notes brighten as they fall towards the bottom of the viewport.
float depth(float y) {
	return 0.12 + 1.4 * pow(clamp(y / hitLine(), 0.0, 1.0), 2.5);
}

// How lit the grid is: around content (matching the .graph-paper mask), and under the mouse
// (matching GridLight).
float illumination(vec2 p) {
	float light = 0.0;
	for (int i = 0; i < ${MAX_LIT}; i++) {
		if (i >= u_litCount) break;
		vec4 box = u_lit[i];
		vec2 radius = max((box.zw - box.xy) * 0.5, vec2(1.0));
		float reach = length((p - (box.xy + box.zw) * 0.5) / radius);
		light = max(light, clamp((1.0 - reach) / 0.6, 0.0, 1.0));
	}
	float pointer = clamp((200.0 - distance(p, u_pointer.xy)) / 160.0, 0.0, 1.0);
	return max(light, pointer * u_pointer.z);
}

// Notes come fully into view as they near the bottom line: late and steep, but smooth.
float arrival(float y) {
	return pow(clamp(1.0 - (hitLine() - y) / ARRIVAL, 0.0, 1.0), 4.0);
}

// Each landed note lights the bottom line from where it hit, spreading outwards and fading.
float flash(float x) {
	float light = 0.0;
	for (int i = 0; i < ${MAX_IMPACTS}; i++) {
		if (i >= u_impactCount) break;
		float distance = abs(x - keyX(u_impacts[i].x));
		float age = u_impacts[i].y;
		float front = SPREAD * age;
		float reached = 1.0 - smoothstep(front - 30.0, front, distance);
		float flicker = 0.55 + 0.9 * noise(vec2(distance / 12.0, age * 10.0 + u_impacts[i].x * 5.0));
		float wave = 0.5 * reached * flicker + 0.8 * exp(-pow((distance - front) / 14.0, 2.0));
		light += wave * exp(-age / FADE - distance / REACH);
		light += 2.5 * exp(-age / 0.08 - distance * distance / 60.0);
	}
	return light;
}

void main() {
	vec2 local = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_scale;
	vec2 p = u_origin + local;
	vec2 cells = (p - 0.5) / CELL;
	vec2 gap = abs(fract(cells + 0.5) - 0.5) * CELL;
	float column = floor(cells.x + 0.5);
	float below = abs(p.y - hitLine());
	if (u_mode != RECEIVER && gap.x > 8.0 && below > 10.0) {
		outColor = vec4(0.0);
		return;
	}

	vec2 note = star(p, column) * depth(p.y);
	float signal;
	if (u_mode == RECEIVER) {
		float edge = lineGlow(u_resolution.y / u_scale - 0.5 - local.y);
		float reach = exp(-pow(max(abs(p.x - u_contact.x) - u_contact.y, 0.0) / 180.0, 2.0));
		float grid = 0.12 * max(lineCore(gap.x), lineCore(gap.y));
		signal = u_contact.z * reach * (grid + note.x + note.y + 0.5 * edge);
	} else {
		// Out of the light only the heads show, faintly. Landings on the bottom line always show.
		float lit = max(illumination(p), arrival(p.y));
		signal = note.x * mix(UNLIT_HEAD, 1.0, lit) + note.y * lit;
		if (below < 10.0) signal += lineGlow(below) * flash(p.x);
	}

	float light = 1.0 - exp(-1.5 * signal);
	vec3 color = mix(AMBER, HOT, clamp(signal - 1.2, 0.0, 1.0) * 0.7);
	outColor = vec4(color * light, light);
}`;

export function createGridRenderer(
	gl: WebGL2RenderingContext,
	roll: PianoRoll
): GridRenderer | null {
	const program = linkProgram(gl);
	if (!program) return null;
	uploadRoll(gl, roll);
	const at = (name: string) => gl.getUniformLocation(program, name);
	const uniforms = {
		keys: at('u_keys'),
		steps: at('u_steps'),
		origin: at('u_origin'),
		resolution: at('u_resolution'),
		scale: at('u_scale'),
		viewport: at('u_viewport'),
		time: at('u_time'),
		stepRate: at('u_stepRate'),
		mode: at('u_mode'),
		contact: at('u_contact'),
		impacts: at('u_impacts'),
		impactCount: at('u_impactCount'),
		lit: at('u_lit'),
		litCount: at('u_litCount'),
		pointer: at('u_pointer')
	};
	const stepRate = stepsPerSecond(roll);
	const onsets = onsetKeys(roll);
	const impacts = new Float32Array(MAX_IMPACTS * 2);
	const lit = new Float32Array(MAX_LIT * 4);

	// Notes that landed recently, newest first, as [key, seconds since landing].
	function collectImpacts(time: number): number {
		let count = 0;
		const oldest = Math.max(Math.ceil((time - FLASH_SECONDS) * stepRate), 0);
		for (let step = Math.floor(time * stepRate); step >= oldest; step--) {
			for (const key of onsets[step % roll.steps]) {
				if (count === MAX_IMPACTS) return count;
				impacts.set([key, time - step / stepRate], count * 2);
				count++;
			}
		}
		return count;
	}

	return (view) => {
		gl.viewport(0, 0, ...view.resolution);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		gl.uniform1i(uniforms.keys, roll.keys);
		gl.uniform1i(uniforms.steps, roll.steps);
		gl.uniform2f(uniforms.origin, ...view.origin);
		gl.uniform2f(uniforms.resolution, ...view.resolution);
		gl.uniform1f(uniforms.scale, view.scale);
		gl.uniform2f(uniforms.viewport, ...view.viewport);
		gl.uniform1f(uniforms.time, view.time);
		gl.uniform1f(uniforms.stepRate, stepRate);
		gl.uniform1i(uniforms.mode, MODES[view.mode]);
		gl.uniform3f(uniforms.contact, ...view.contact);
		gl.uniform1i(uniforms.impactCount, view.mode === 'field' ? collectImpacts(view.time) : 0);
		gl.uniform2fv(uniforms.impacts, impacts);
		const boxes = view.lit.slice(0, MAX_LIT);
		boxes.forEach((box, i) => lit.set(box, i * 4));
		gl.uniform1i(uniforms.litCount, boxes.length);
		gl.uniform4fv(uniforms.lit, lit);
		gl.uniform3f(uniforms.pointer, ...view.pointer);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	};
}

function uploadRoll(gl: WebGL2RenderingContext, roll: PianoRoll) {
	const { width, height, data } = rollTexture(roll);
	gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG8, width, height, 0, gl.RG, gl.UNSIGNED_BYTE, data);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function linkProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
	const program = gl.createProgram();
	const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX);
	const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
	if (!vertex || !fragment) return null;
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
	console.warn(gl.getProgramInfoLog(program), gl.getShaderInfoLog(fragment));
	return null;
}

function compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	return shader;
}
