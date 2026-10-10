export type GridMode = 'field' | 'receiver';

export type Box = [left: number, top: number, right: number, bottom: number];

export const BLENDS = [
	'normal',
	'add',
	'screen',
	'multiply',
	'overlay',
	'soft-light',
	'difference',
	'exclusion',
	'color-dodge',
	'lighten'
] as const;

export type Blend = (typeof BLENDS)[number];

export type Photo = { image: HTMLImageElement; box: Box };

export type GridView = {
	origin: [number, number];
	resolution: [number, number];
	scale: number;
	viewport: [number, number];
	time: number;
	activity: number;
	mode: GridMode;
	contact: [centre: number, halfWidth: number, energy: number];
	islands: readonly Box[];
	pointer: [x: number, y: number, presence: number];
	wave: [originX: number, originY: number, radius: number, strength: number];
	blend: Blend;
	photo: Photo | null;
};

export type GridRenderer = (view: GridView) => void;

const MODES: Record<GridMode, number> = { field: 0, receiver: 1 };
const MAX_ISLANDS = 8;

const VERTEX = `#version 300 es
void main() {
	vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
	gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 u_origin;
uniform vec2 u_resolution;
uniform float u_scale;
uniform vec2 u_viewport;
uniform float u_time;
uniform float u_activity;
uniform int u_mode;
uniform vec3 u_contact;
uniform vec4 u_islands[${MAX_ISLANDS}];
uniform int u_islandCount;
uniform vec3 u_pointer;
uniform vec4 u_wave;
uniform int u_blend;
uniform sampler2D u_photo;
uniform vec2 u_photoSize;
uniform vec4 u_photoBox;

out vec4 outColor;

const int RECEIVER = ${MODES.receiver};
${BLENDS.map((name, index) => `const int ${name.toUpperCase().replace('-', '_')} = ${index};`).join('\n')}
const float CELL = 32.0;
const float LIT_SHARE = 0.2;
const float SPACING = 720.0;
const float WAVE_TAIL = 560.0;
const float FRONT_LIGHT = 0.8;
const float TAIL_LIGHT = 0.7;
const float FLASH_SECONDS = 1.5;
const float FLASH_REACH = 600.0;
const int FLASH_COLUMNS = 40;
const float SPREAD = 700.0;
const float FADE = 0.25;
const float REACH = 200.0;
const vec3 AMBER = vec3(0.994, 0.602, 0.0);
const vec3 HOT = vec3(1.0, 0.86, 0.6);
const vec3 ISLAND = vec3(0.0, 0.827, 0.951);
const vec3 STONE = vec3(0.047, 0.039, 0.036);
const vec3 PHOTO_CYAN = vec3(0.0, 0.722, 0.857);
const vec3 PHOTO_VIOLET = vec3(0.589, 0.488, 0.868);
const vec3 PHOTO_FUCHSIA = vec3(0.784, 0.0, 0.872);
const float PHOTO_ANGLE = radians(110.0);
const float PHOTO_DIM = 0.2;

struct Cell {
	vec2 gap;
	float column;
	float lines;
	float nearest;
};

struct Wave {
	float front;
	float bloom;
	float tail;
	float strength;
};

float hash(float n) {
	return fract(sin(n * 127.1 + 311.7) * 43758.5453);
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

float lineCore(float gap) {
	return 1.0 - smoothstep(0.0, 1.0, gap);
}

float lineGlow(float gap) {
	return lineCore(gap) + 0.35 * exp(-gap * gap / 6.0);
}

vec4 over(vec4 top, vec4 below) {
	return top + below * (1.0 - top.a);
}

Cell cellAt(vec2 p) {
	vec2 cells = (p - 0.5) / CELL;
	vec2 gap = abs(fract(cells + 0.5) - 0.5) * CELL;
	return Cell(gap, floor(cells.x + 0.5), max(lineCore(gap.x), lineCore(gap.y)), min(gap.x, gap.y));
}

float lit(float column) {
	float threshold = 1.0 - LIT_SHARE * u_activity;
	return smoothstep(threshold, threshold + 0.015, hash(column));
}

float speed(float column) {
	return mix(0.05, 0.18, hash(column + 17.0));
}

float fall(float y, float column) {
	return fract(y / SPACING - u_time * speed(column) + hash(column + 41.0));
}

float pulse(float y, float column) {
	return lit(column) * pow(fall(y, column), 28.0);
}

float signalAt(vec2 p, Cell cell) {
	return lineGlow(cell.gap.x) * pulse(p.y, cell.column);
}

float spread(vec2 p) {
	float away = max(abs(p.x - u_contact.x) - u_contact.y, 0.0);
	return pow(1.0 - fract(away / 240.0 - u_time * 0.8), 12.0) * exp(-away / 500.0);
}

float hitLine() {
	return floor((u_viewport.y - 2.5) / CELL) * CELL + 0.5;
}

float hitFlash(float x) {
	float hit = hitLine();
	float first = floor((x - FLASH_REACH) / CELL);
	float light = 0.0;
	for (int i = 0; i < FLASH_COLUMNS; i++) {
		float column = first + float(i);
		float on = lit(column);
		float age = (1.0 - fall(hit, column)) / speed(column);
		if (on == 0.0 || age > FLASH_SECONDS) continue;
		float distance = abs(x - column * CELL - 0.5);
		float front = SPREAD * age;
		float reached = 1.0 - smoothstep(front - 30.0, front, distance);
		float flicker = 0.55 + 0.9 * noise(vec2(distance / 12.0, age * 10.0 + column * 5.0));
		float ripple = 0.5 * reached * flicker + 0.8 * exp(-pow((distance - front) / 14.0, 2.0));
		light += on * ripple * exp(-age / FADE - distance / REACH);
		light += on * 2.5 * exp(-age / 0.08 - distance * distance / 60.0);
	}
	return light;
}

float contentIsland(vec2 p) {
	float island = 0.0;
	for (int i = 0; i < ${MAX_ISLANDS}; i++) {
		if (i >= u_islandCount) break;
		vec4 box = u_islands[i];
		vec2 radius = max((box.zw - box.xy) * 0.5, vec2(1.0));
		float reach = length((p - (box.xy + box.zw) * 0.5) / radius);
		island = max(island, clamp((1.0 - reach) / 0.6, 0.0, 1.0));
	}
	return island;
}

float mouseIsland(vec2 p) {
	return clamp((200.0 - distance(p, u_pointer.xy)) / 160.0, 0.0, 1.0) * u_pointer.z;
}

float waveWander(vec2 away) {
	vec2 heading = normalize(u_viewport * 0.5 - u_wave.xy);
	float along = atan(heading.x * away.y - heading.y * away.x, dot(heading, away)) * u_wave.z;
	vec2 seed = vec2(hash(u_wave.xy) * 97.0, u_time * 0.6);
	float wander = 0.65 * noise(vec2(along / 180.0, 0.0) + seed) + 0.35 * noise(vec2(along / 60.0, 0.0) - seed);
	return mix(0.2, 1.0, wander);
}

Wave waveAt(vec2 p) {
	vec2 away = p - u_wave.xy;
	float behind = u_wave.z - length(away);
	float tail = behind < 0.0 ? 0.0 : pow(1.0 - min(behind / WAVE_TAIL, 1.0), 3.0);
	return Wave(
		exp(-behind * behind / 3.0),
		exp(-behind * behind / 128.0),
		tail,
		u_wave.w * waveWander(away)
	);
}

vec3 blend(vec3 wave, vec3 island) {
	vec3 s = wave;
	vec3 b = island;
	switch (u_blend) {
	case ADD: return min(s + b, 1.0);
	case SCREEN: return s + b - s * b;
	case MULTIPLY: return s * b;
	case OVERLAY: return mix(2.0 * s * b, 1.0 - 2.0 * (1.0 - s) * (1.0 - b), step(0.5, b));
	case SOFT_LIGHT: {
		vec3 d = mix(((16.0 * b - 12.0) * b + 4.0) * b, sqrt(b), step(0.25, b));
		return mix(b - (1.0 - 2.0 * s) * b * (1.0 - b), b + (2.0 * s - 1.0) * (d - b), step(0.5, s));
	}
	case DIFFERENCE: return abs(s - b);
	case EXCLUSION: return s + b - 2.0 * s * b;
	case COLOR_DODGE: return min(b / max(1.0 - s, 0.001), 1.0);
	case LIGHTEN: return max(s, b);
	default: return s;
	}
}

float luminosity(vec3 color) {
	return dot(color, vec3(0.3, 0.59, 0.11));
}

vec3 withLuminosity(vec3 color, float target) {
	vec3 shifted = color + (target - luminosity(color));
	float lum = luminosity(shifted);
	float low = min(min(shifted.r, shifted.g), shifted.b);
	float high = max(max(shifted.r, shifted.g), shifted.b);
	if (low < 0.0) shifted = lum + (shifted - lum) * lum / (lum - low);
	if (high > 1.0) shifted = lum + (shifted - lum) * (1.0 - lum) / (high - lum);
	return shifted;
}

vec2 photoUV(vec2 p) {
	vec2 size = u_photoSize * max(u_viewport.x / u_photoSize.x, u_viewport.y / u_photoSize.y);
	return (p - (u_viewport - size) * 0.5) / size;
}

vec3 photoTint(vec2 p) {
	vec2 heading = vec2(sin(PHOTO_ANGLE), -cos(PHOTO_ANGLE));
	float span = abs(u_viewport.x * heading.x) + abs(u_viewport.y * heading.y);
	float along = clamp((dot(p - u_viewport * 0.5, heading) / span + 0.3) / 0.6, 0.0, 1.0);
	return along < 0.5
		? mix(PHOTO_CYAN, PHOTO_VIOLET, along * 2.0)
		: mix(PHOTO_VIOLET, PHOTO_FUCHSIA, along * 2.0 - 1.0);
}

vec3 fadePhoto(vec2 p, vec3 color) {
	vec2 size = u_photoBox.zw - u_photoBox.xy;
	vec2 inside = (p - u_photoBox.xy) / size;
	float corner = length(vec2(1.0, 0.55 / 0.45));
	float vignette = length((inside - vec2(0.5, 0.45)) / (vec2(0.5, 0.45) * corner));
	color = mix(color, STONE, clamp((vignette - 0.35) / 0.6, 0.0, 1.0));
	return mix(color, STONE, clamp((inside.y - 0.5) / 0.5, 0.0, 1.0));
}

vec3 addScanlines(vec2 p, vec3 color) {
	return fract(p.y / 3.0) >= 2.0 / 3.0 ? color * 0.7 : color;
}

float photoLight(float mouse, Wave wave) {
	return max(smoothstep(0.0, 1.0, mouse), wave.strength * min(wave.tail + wave.bloom, 1.0));
}

vec4 photoLayer(vec2 p, float light) {
	bool inside = all(greaterThanEqual(p, u_photoBox.xy)) && all(lessThan(p, u_photoBox.zw));
	if (u_photoSize.x == 0.0 || !inside || light <= 0.0) return vec4(0.0);
	float shade = luminosity(texture(u_photo, photoUV(p)).rgb);
	vec3 color = mix(withLuminosity(photoTint(p), shade), STONE, PHOTO_DIM);
	return vec4(addScanlines(p, fadePhoto(p, color)), 1.0) * light;
}

bool isUnlit(vec2 p, Cell cell, Wave wave) {
	return cell.nearest > 8.0 && wave.bloom + wave.tail < 0.01 &&
		distance(p, u_pointer.xy) > 200.0 && abs(p.y - hitLine()) > 10.0;
}

vec4 islandLayer(vec2 p, Cell cell, float content, float mouse) {
	float glow = 0.05 * max(1.0 - distance(p, u_pointer.xy) / 160.0, 0.0) * mouse;
	return vec4(ISLAND, 1.0) * (cell.lines * max(0.1 * content, 0.14 * mouse) + glow);
}

vec4 waveLayer(Cell cell, Wave wave, float island) {
	float halo = exp(-cell.nearest * cell.nearest / 8.0);
	float arc = wave.front + 0.3 * wave.bloom + wave.bloom * (0.6 * cell.lines + 0.4 * halo);
	float light = wave.strength * (FRONT_LIGHT * arc + TAIL_LIGHT * wave.tail * (cell.lines + 0.08));
	vec3 front = mix(AMBER, HOT, 0.6 * wave.front);
	vec3 tint = mix(front, blend(front, ISLAND), island);
	return vec4(tint, 1.0) * (1.0 - exp(-1.2 * light));
}

vec4 signalLayer(vec2 p, Cell cell, float shown) {
	if (p.y > hitLine() + 1.0) return vec4(0.0);
	return vec4(AMBER, 1.0) * clamp(signalAt(p, cell) * 0.85, 0.0, 1.0) * shown;
}

vec4 hitLayer(vec2 p) {
	float below = abs(p.y - hitLine());
	if (below >= 10.0) return vec4(0.0);
	float light = lineGlow(below) * hitFlash(p.x);
	vec3 heat = mix(AMBER, HOT, clamp(light - 1.2, 0.0, 1.0) * 0.7);
	return vec4(heat, 1.0) * (1.0 - exp(-1.5 * light));
}

vec4 fieldColor(vec2 p) {
	Cell cell = cellAt(p);
	Wave wave = waveAt(p);
	if (isUnlit(p, cell, wave)) return vec4(0.0);
	float content = contentIsland(p);
	float mouse = mouseIsland(p);
	float island = max(content, mouse);
	vec4 color = photoLayer(p, photoLight(mouse, wave));
	color = over(islandLayer(p, cell, content, mouse), color);
	color = over(waveLayer(cell, wave, island), color);
	color = over(signalLayer(p, cell, max(island, wave.tail)), color);
	return over(hitLayer(p), color);
}

vec4 receiverColor(vec2 p, vec2 local) {
	Cell cell = cellAt(p);
	float edge = lineGlow(u_resolution.y / u_scale - 0.5 - local.y);
	float reach = exp(-pow(max(abs(p.x - u_contact.x) - u_contact.y, 0.0) / 180.0, 2.0));
	float grid = clamp((0.12 * cell.lines * reach + edge * spread(p)) * 0.85, 0.0, 1.0);
	float glow = clamp(signalAt(p, cell) * reach * 0.85, 0.0, 1.0);
	return u_contact.z * over(vec4(AMBER, 1.0) * glow, vec4(ISLAND, 1.0) * grid);
}

void main() {
	vec2 local = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_scale;
	vec2 p = u_origin + local;
	outColor = u_mode == RECEIVER ? receiverColor(p, local) : fieldColor(p);
}`;

export function createGridRenderer(gl: WebGL2RenderingContext): GridRenderer | null {
	const program = linkProgram(gl);
	if (!program) return null;
	const at = (name: string) => gl.getUniformLocation(program, name);
	const uniforms = {
		origin: at('u_origin'),
		resolution: at('u_resolution'),
		scale: at('u_scale'),
		viewport: at('u_viewport'),
		time: at('u_time'),
		activity: at('u_activity'),
		mode: at('u_mode'),
		contact: at('u_contact'),
		islands: at('u_islands'),
		islandCount: at('u_islandCount'),
		pointer: at('u_pointer'),
		wave: at('u_wave'),
		blend: at('u_blend'),
		photoSize: at('u_photoSize'),
		photoBox: at('u_photoBox')
	};
	const islands = new Float32Array(MAX_ISLANDS * 4);
	const photoTexture = gl.createTexture();
	let uploadedPhoto: HTMLImageElement | null = null;

	const uploadPhoto = (image: HTMLImageElement) => {
		gl.bindTexture(gl.TEXTURE_2D, photoTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		uploadedPhoto = image;
	};

	return (view) => {
		gl.viewport(0, 0, ...view.resolution);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		gl.uniform2f(uniforms.origin, ...view.origin);
		gl.uniform2f(uniforms.resolution, ...view.resolution);
		gl.uniform1f(uniforms.scale, view.scale);
		gl.uniform2f(uniforms.viewport, ...view.viewport);
		gl.uniform1f(uniforms.time, view.time);
		gl.uniform1f(uniforms.activity, view.activity);
		gl.uniform1i(uniforms.mode, MODES[view.mode]);
		gl.uniform3f(uniforms.contact, ...view.contact);
		const boxes = view.islands.slice(0, MAX_ISLANDS);
		boxes.forEach((box, i) => islands.set(box, i * 4));
		gl.uniform4fv(uniforms.islands, islands);
		gl.uniform1i(uniforms.islandCount, boxes.length);
		gl.uniform3f(uniforms.pointer, ...view.pointer);
		gl.uniform4f(uniforms.wave, ...view.wave);
		gl.uniform1i(uniforms.blend, BLENDS.indexOf(view.blend));
		if (view.photo && view.photo.image !== uploadedPhoto) uploadPhoto(view.photo.image);
		const image = view.photo?.image;
		gl.uniform2f(uniforms.photoSize, image?.naturalWidth ?? 0, image?.naturalHeight ?? 0);
		gl.uniform4f(uniforms.photoBox, ...(view.photo?.box ?? [0, 0, 0, 0]));
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	};
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
