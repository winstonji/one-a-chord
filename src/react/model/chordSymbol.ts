import { hasDuplicates, parseChordSymbol } from "../utils/chordSymbolUtils";
import { extensionsPattern, qualitiesPattern, rootsPattern, slashesPattern } from "./constants/chordSymbolConstants";
import { Identifiable } from "./interfaces/identifiable";
import { Key, KeyValue } from "./key";
import { LineElement } from "./lineElement";
import { v4 as uuidv4 } from 'uuid';

export class ChordSymbol implements Identifiable {
    public backingString:string = "";
    public root?:KeyValue;
    public quality?:string;
    public extensions?:string[];
    public slash?:KeyValue;
    public parent:LineElement;
    public id: string;

    constructor(parent:LineElement, backingString:string){
        this.setChordSymbol(backingString);
        this.parent = parent;
        this.id = uuidv4();
    }

    public setChordSymbol = function(newChordSymbol:string){
        this.backingString = newChordSymbol;
        let newRoot = parseChordSymbol(newChordSymbol, rootsPattern);
		let newQuality = parseChordSymbol(newChordSymbol, qualitiesPattern);
		let newExtensions = parseChordSymbol(newChordSymbol, extensionsPattern);
		let newSlash = parseChordSymbol(newChordSymbol, slashesPattern);
        if (newRoot.length > 1) {
			console.error("Invalid chord symbol: you can only have one root.");
		} else if (newQuality.length > 1) {
			console.error("Invalid chord symbol: you can only have one chord quality.");
		} else if (newSlash.length > 1) {
			console.error("Invalid chord symbol: you can only have one slash root.");
		} else if (hasDuplicates(newExtensions)) {
			console.error("Invalid chord symbol: duplicate extension detected.");
		} else {
			this.root = Key.getKeyValueByPrintName(newRoot[0] ?? '');
			this.quality = newQuality[0];
			this.extensions = newExtensions;
			this.slash = Key.getKeyValueByPrintName(newSlash[0]);
		}
    }
}
