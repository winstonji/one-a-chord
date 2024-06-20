import { KeyValue, Key } from "./key";
import { Line } from "./line";
import { Identifiable } from "./interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';
import { extensionsPattern, qualitiesPattern, rootsPattern, slashesPattern } from "./constants/chordSymbolConstants";
import { hasDuplicates, parseChordSymbol } from "../utils/chordSymbolUtils";

export class ChordWrapper implements Identifiable{

    public backingString:string = "";
    public root?:KeyValue;
    public quality?:string;
    public extensions?:string[];
    public slash?:KeyValue;
    public lyricSegment:string = "";
    public id: string;
    public parent: Line;

    constructor(parent: Line, id: string, backingString:string, lyricSegment:string){
        this.id = id;
        this.parent = parent;
        this.setChordSymbol(backingString);
        this.lyricSegment = lyricSegment;
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
    
    setLyricSegment = function(newLyric:string) {
        this.lyricSegment = newLyric;
    }

    getNext = function(): ChordWrapper{
        return this.getNeighbor(1);
    }

    getPrevious = function(): ChordWrapper{
        return this.getNeighbor(-1);
    }

    getNeighbor = function(direction: 1 | -1): ChordWrapper{

        const line:Line = this.parent;
        const currentIndex:number = line.children.findIndex(cw => cw.id === this.id)
        const neighborIndex = currentIndex + direction;
        if (neighborIndex < line.children.length) {
            return line.children[neighborIndex];
        }
        return null;
    }
}