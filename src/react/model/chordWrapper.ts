import { KeyValue } from "./key";

export class ChordWrapper{

    public root?:KeyValue;
    public quality?:string;
    public extension?:string;
    public slash?:KeyValue;

    public lyricSegment:string = "";

    constructor(root:KeyValue, quality:string, extension:string, slash:KeyValue, lyricSegment:string){
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