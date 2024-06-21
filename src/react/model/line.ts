import { Block } from "./block";
import { ChordWrapper } from "./chordWrapper";
import { Identifiable } from "./interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';

export class Line implements Identifiable{

    public children?:ChordWrapper[];
    public id: string;
    public parent: Block;

    constructor(parent: Block, id: string){
        this.id = id;
        this.parent = parent;
    }

    getNext = function(): Line{
        return this.getNeighbor(1);
    }

    getPrevious = function(): Line{
        return this.getNeighbor(-1);
    }

    getNeighbor = function(direction: 1 | -1): Line{
        const block:Block = this.parent;
        const currentIndex:number = block.children.findIndex(ln => ln.id === this.id)
        const neighborIndex = currentIndex + direction;
        if (neighborIndex < block.children.length && neighborIndex >= 0) {
            return block.children[neighborIndex];
        }
        else if (neighborIndex < 0) {
            const previousBlock = block.getPrevious();
            return previousBlock ? previousBlock.children[previousBlock.children.length - 1] : null;
        } else if (neighborIndex >= block.children.length) {
            const nextBlock = block.getNext();
            return nextBlock ? nextBlock.children[0] : null;
        }
        return null;
    }
}