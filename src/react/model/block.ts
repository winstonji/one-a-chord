import { Line } from "./line";
import { Chart } from "./chart";
import { Identifiable } from "./interfaces/identifiable";

export class Block implements Identifiable{

    
    public header:string;
    public id: string;
    public chart:Chart;
    public children:Line[];
    
    constructor(chart: Chart, header:string, id: string){
        this.id = id;
        this.header = header;
        this.chart = chart;
    }

    getNext = function(): Block{
        return this.getNeighbor(1);
    }

    getPrevious = function(): Block{
        return this.getNeighbor(-1);
    }

    getNeighbor = function(direction: 1 | -1): Block{
        const currentIndex:number = this.chart.children.findIndex(block => block.id === this.id)
        const neighborIndex = currentIndex + direction;
        if (neighborIndex < this.chart.children.length) {
            return this.chart.children[neighborIndex];
        }
        return null;
    }
}