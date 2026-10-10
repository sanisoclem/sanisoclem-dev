export type PianoRoll = {
	tempo: number;
	stepsPerBeat: number;
	lowest: number;
	keys: number;
	steps: number;
	keyStartLength: readonly number[];
	credit: string;
};

export type RollTexture = { width: number; height: number; data: Uint8Array };

const MAX_ROWS = 2048;
const MAX_COUNT = 255;

/**
 * Two channels per key and step: the steps since that key's last onset (plus one, so zero means
 * the key hasn't been played yet) and the length of that note. Long songs are tiled into columns
 * of keys so the texture stays within the guaranteed WebGL2 size.
 */
export function rollTexture(roll: PianoRoll): RollTexture {
	const rows = Math.min(roll.steps, MAX_ROWS);
	const width = roll.keys * Math.ceil(roll.steps / rows);
	const data = new Uint8Array(width * rows * 2);
	const lengths = new Uint16Array(roll.keys * roll.steps);
	forEachNote(roll, (key, start, length) => {
		const at = start * roll.keys + key;
		lengths[at] = Math.max(lengths[at], length);
	});
	for (let key = 0; key < roll.keys; key++) {
		let since = -1;
		let length = 0;
		for (let step = 0; step < roll.steps; step++) {
			const onset = lengths[step * roll.keys + key];
			if (onset) [since, length] = [0, onset];
			else if (since >= 0) since++;
			if (since < 0) continue;
			const texel = (step % rows) * width + Math.floor(step / rows) * roll.keys + key;
			data[texel * 2] = Math.min(since + 1, MAX_COUNT);
			data[texel * 2 + 1] = Math.min(length, MAX_COUNT);
		}
	}
	return { width, height: rows, data };
}

/** The keys struck on each step. */
export function onsetKeys(roll: PianoRoll): number[][] {
	const keys: number[][] = Array.from({ length: roll.steps }, () => []);
	forEachNote(roll, (key, start) => {
		if (!keys[start].includes(key)) keys[start].push(key);
	});
	return keys;
}

export function stepsPerSecond(roll: PianoRoll): number {
	return (roll.tempo / 60) * roll.stepsPerBeat;
}

function forEachNote(roll: PianoRoll, visit: (key: number, start: number, length: number) => void) {
	const notes = roll.keyStartLength;
	for (let i = 0; i < notes.length; i += 3) {
		visit(notes[i] - roll.lowest, notes[i + 1] % roll.steps, notes[i + 2]);
	}
}
