export const validRoots: ReadonlyArray<string> = Object.freeze(["Gb", "G#", "G", "Db", "D#", "D", "B"]);
export const validQualities: ReadonlyArray<string> = Object.freeze(["maj", "min", "dim", "aug", "halfdim", "sus"]);
export const validExtensions: ReadonlyArray<string> = Object.freeze(["7", "9", "13", "add2", "b5", "#11", "b13", "alt"]);
export const validslashes: ReadonlyArray<string> = Object.freeze(validRoots.map((root) => '/' + root));

export const rootsPattern = new RegExp(validRoots.map(root => `(?<!/)${root}`).join('|'), 'g');
export const qualitiesPattern = new RegExp(validQualities.join('|'), 'g');
export const extensionsPattern = new RegExp(validExtensions.join('|'), 'g');
export const slashesPattern = new RegExp(validRoots.map(root => `(?<=/)${root}`).join('|'), 'g');