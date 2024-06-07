import { Block } from "./block";
import { ChordWrapper } from "./chordWrapper";
import { ModelWithId } from "./modelWithId";
import { v4 as uuidv4 } from 'uuid';

export class Line implements ModelWithId{

    public chordWrappers?:ChordWrapper[];
    public id: string;
    public parent: Block;

    constructor(parent: Block){
        this.id = uuidv4();
        this.parent = parent;
    }
    
}