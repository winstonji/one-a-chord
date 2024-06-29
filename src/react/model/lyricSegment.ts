import { Identifiable } from "./interfaces/identifiable";
import { LineElement } from "./lineElement";
import { v4 as uuidv4 } from 'uuid';

export class LyricSegment implements Identifiable{
    public lyric:string = "";
    public id:string;
    public parent:LineElement;

    constructor(parent:LineElement, lyric:string){
        this.lyric = lyric;
        this.parent = parent;
        this.id = uuidv4();
    }
}