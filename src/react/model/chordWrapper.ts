import { Key } from "./key";

export class ChordWrapper{

    public chord:Key;
    public quality?:string;
    public extension?:string;
    public slash?:Key;

    public lyricSegment:string;

    constructor(){}
}