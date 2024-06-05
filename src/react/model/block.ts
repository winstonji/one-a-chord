import { Line } from "./line";

export class Block{
    
    public header:string;
    public lines:Line[];
    
    constructor(header:string, lines:Line[]){
        this.header = header;
        this.lines = lines;
    }

}