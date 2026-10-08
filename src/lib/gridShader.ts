export type GridView = {
	origin: [number, number];
	resolution: [number, number];
	scale: number;
	time: number;
	activity: number;
	receiver: boolean;
	contact: [centre: number, halfWidth: number, energy: number];
};

export type GridRenderer = (view: GridView) => void;

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
uniform float u_time;
uniform float u_activity;
uniform float u_receiver;
uniform vec3 u_contact;

out vec4 outColor;

const float CELL = 32.0;
const float LIT_SHARE = 0.2;
const vec3 AMBER = vec3(0.996, 0.604, 0.0);

float hash(float n) {
	return fract(sin(n * 127.1 + 311.7) * 43758.5453);
}

float lineCore(float gap) {
	return 1.0 - smoothstep(0.0, 1.0, gap);
}

float lineGlow(float gap) {
	return lineCore(gap) + 0.35 * exp(-gap * gap / 6.0);
}

float lit(float column) {
	float threshold = 1.0 - LIT_SHARE * u_activity;
	return smoothstep(threshold, threshold + 0.015, hash(column));
}

float pulse(float y, float column) {
	float speed = mix(0.05, 0.18, hash(column + 17.0));
	float phase = hash(column + 41.0);
	float head = 1.0 - fract(y / 720.0 + u_time * speed + phase);
	return lit(column) * pow(head, 28.0);
}

float wave(vec2 p) {
	float bend = 0.05 * sin(p.x / 260.0) * cos(p.x / 170.0);
	return u_activity * pow(1.0 - fract(p.y / 1600.0 + u_time * 0.045 + bend), 40.0);
}

float spread(vec2 p) {
	float away = max(abs(p.x - u_contact.x) - u_contact.y, 0.0);
	return pow(1.0 - fract(away / 240.0 - u_time * 0.8), 12.0) * exp(-away / 500.0);
}

void main() {
	vec2 local = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_scale;
	vec2 p = u_origin + local;
	vec2 cells = (p - 0.5) / CELL;
	vec2 gap = abs(fract(cells + 0.5) - 0.5) * CELL;
	float column = floor(cells.x + 0.5);

	float signal = lineGlow(gap.x) * pulse(p.y, column) + 0.5 * lineGlow(gap.y) * wave(p);

	if (u_receiver > 0.5) {
		float edge = lineGlow(u_resolution.y / u_scale - 0.5 - local.y);
		float reach = exp(-pow(max(abs(p.x - u_contact.x) - u_contact.y, 0.0) / 180.0, 2.0));
		float grid = 0.12 * max(lineCore(gap.x), lineCore(gap.y));
		signal = u_contact.z * (reach * (grid + signal) + edge * spread(p));
	}

	float light = clamp(signal * 0.85, 0.0, 1.0);
	outColor = vec4(AMBER * light, light);
}`;

export function createGridRenderer(gl: WebGL2RenderingContext): GridRenderer | null {
	const program = linkProgram(gl);
	if (!program) return null;
	const at = (name: string) => gl.getUniformLocation(program, name);
	const uniforms = {
		origin: at('u_origin'),
		resolution: at('u_resolution'),
		scale: at('u_scale'),
		time: at('u_time'),
		activity: at('u_activity'),
		receiver: at('u_receiver'),
		contact: at('u_contact')
	};

	return (view) => {
		gl.viewport(0, 0, ...view.resolution);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		gl.uniform2f(uniforms.origin, ...view.origin);
		gl.uniform2f(uniforms.resolution, ...view.resolution);
		gl.uniform1f(uniforms.scale, view.scale);
		gl.uniform1f(uniforms.time, view.time);
		gl.uniform1f(uniforms.activity, view.activity);
		gl.uniform1f(uniforms.receiver, view.receiver ? 1 : 0);
		gl.uniform3f(uniforms.contact, ...view.contact);
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
