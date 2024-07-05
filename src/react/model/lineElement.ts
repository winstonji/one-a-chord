import { Line } from "./line";
import { Identifiable } from "./interfaces/identifiable";
import { ChordSymbol } from "./chordSymbol";
import { LyricSegment } from "./lyricSegment";

export class LineElement implements Identifiable{

    public chordSymbol:ChordSymbol;
    public lyricSegment:LyricSegment;
    public id: string;
    public parent: Line;

    constructor(parent: Line, id: string, backingString:string, lyricSegment:string){
        this.id = id;
        this.parent = parent;
        this.chordSymbol = new ChordSymbol(this, backingString);
        this.lyricSegment = new LyricSegment(this, lyricSegment);
    }
    
    getNext = function(): LineElement{
        return this.getNeighbor(1);
    }

    getPrevious = function(): LineElement{
        return this.getNeighbor(-1);
    }

    getNeighbor = function(direction: 1 | -1): LineElement{
        const line:Line = this.parent;
        const currentIndex:number = line.children.findIndex(le => le.id === this.id);
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
}