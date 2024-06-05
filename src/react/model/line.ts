import { ChordWrapper } from "./chordWrapper";

export class Line{

    public chordWrappers:ChordWrapper[];

    constructor(chordWrappers:ChordWrapper[]){
        this.chordWrappers = chordWrappers;
    }
}