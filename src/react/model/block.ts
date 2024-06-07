import { Line } from "./line";
import { ModelWithId } from "./modelWithId";
import { v4 as uuidv4 } from 'uuid';

export class Block implements ModelWithId{

    
    public header:string;
    public id: string;
    public lines?:Line[];
    
    constructor(header:string){
        this.id = uuidv4();
        this.header = header;
    }
}