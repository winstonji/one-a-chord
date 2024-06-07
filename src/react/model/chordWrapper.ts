import { KeyValue } from "./key";
import { Line } from "./line";
import { Identifiable } from "./interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';

export class ChordWrapper implements Identifiable{

    
    public root?:KeyValue;
    public quality?:string;
    public extension?:string;
    public slash?:KeyValue;
    public lyricSegment:string = "";
    public id: string;
    public parent: Line;

    constructor(parent: Line, id: string, root:KeyValue, quality:string, extension:string, slash:KeyValue, lyricSegment:string){
        this.id = id;
        this.parent = parent;
        this.root = root;
        this.quality = quality;
        this.extension = extension;
        this.slash = slash;
        this.lyricSegment = lyricSegment;
    }
    

    setLyricSegment = (newLyric:string) => {
        this.lyricSegment = newLyric;
    }
}