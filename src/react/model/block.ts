import { Line } from "./line";
import { Chart } from "./chart";
import { Identifiable } from "./interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';

export class Block implements Identifiable{

    
    public header:string;
    public id: string;
    public parent?:Chart;
    public children:Line[];
    
    constructor(parent: Chart, header:string, id: string){
        this.id = id;
        this.header = header;
        this.parent = parent;
    }

    getNext = function(): Block{
        return this.getNeighbor(1);
    }

    getPrevious = function(): Block{
        return this.getNeighbor(-1);
    }

    getNeighbor = function(direction: 1 | -1): Block{
        const chart:Chart = this.parent;
        const currentIndex:number = chart.children.findIndex(block => block.id === this.id)
        const neighborIndex = currentIndex + direction;
        if (neighborIndex < chart.children.length) {
            return chart.children[neighborIndex];
        }
        return null;
    }

    getStart = function(): Line {
        return this.children[0];
    }

    getEnd = function(): Line {
        return this.children[this.children.length - 1];
    }

    getFirst = function(): Block{
        return this.parent.children[0];
    }

    getLast = function(): Block{
        return this.parent.children[this.parent.children.length - 1];
    }
}