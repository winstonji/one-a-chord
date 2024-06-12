import { Line } from "./line";
import { Identifiable } from "./interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';

export class Block implements Identifiable{

    
    public header:string;
    public id: string;
    public children?:Line[];
    
    constructor(header:string, id: string){
        this.id = id;
        this.header = header;
    }
}