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
    
}