import { KeyValue } from "./key";
import { Line } from "./line";
import { ModelWithId } from "./modelWithId";
import { v4 as uuidv4 } from 'uuid';

export class ChordWrapper implements ModelWithId{

    
    public root?:KeyValue;
    public quality?:string;
    public extension?:string;
    public slash?:KeyValue;
    public lyricSegment:string = "";
    public id: string;
    public parent: Line;

    constructor(parent: Line, root:KeyValue, quality:string, extension:string, slash:KeyValue, lyricSegment:string){
        this.id = uuidv4();
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