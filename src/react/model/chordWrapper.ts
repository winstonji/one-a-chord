import { KeyValue, Key } from "./key";
import { Line } from "./line";
import { Identifiable } from "./interfaces/identifiable";
import { extensionsPattern, qualitiesPattern, rootsPattern, slashesPattern } from "./constants/chordSymbolConstants";
import { hasDuplicates, parseChordSymbol } from "../utils/chordSymbolUtils";
import { Children } from "react";
import { first } from "rxjs";

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
        const currentIndex:number = line.children.findIndex(cw => cw.id === this.id);
        const neighborIndex = currentIndex + direction;
        if (neighborIndex < line.children.length && neighborIndex >= 0) {
            return line.children[neighborIndex];
        }
        else if (neighborIndex < 0) {
            const previousLine = line.getPrevious();
            return previousLine ? previousLine.children[previousLine.children.length - 1] : null;
        } else if (neighborIndex >= line.children.length) {
            const nextLine = line.getNext();
            return nextLine ? nextLine.children[0] : null;
        }
        return null;
    }

    getFirstInBlock = function(): ChordWrapper{
        const firstLine:Line = this.parent.getFirstInBlock();
        const firstInBlock = firstLine.getStart();
        if (this.id === firstInBlock.id) {
            return this.getPrevious();
        }
        return firstInBlock;
    }

    getLastInBlock = function(): ChordWrapper{
        const lastLine:Line = this.parent.getLastInBlock();
        const lastInBlock:ChordWrapper = lastLine.getEnd();
        if (this.id === lastInBlock.id) {
            return this.getNext();
        }
        return lastInBlock;
    }

    jumpUp = function(): ChordWrapper{
        return this.jumpLine(-1);
    }

    jumpDown = function(): ChordWrapper{
        return this.jumpLine(1);
    }

    jumpLine = function(direction: -1 | 1): ChordWrapper {
        const currentLine: Line = this.parent;
        const currentIndex: number = currentLine.children.findIndex(cw => cw.id === this.id);
        const nextLine = currentLine.getNeighbor(direction);
        if (currentIndex >= nextLine.children.length) {
            return nextLine.children[nextLine.children.length - 1];
        }
        return nextLine.children[currentIndex];
    }
    
}