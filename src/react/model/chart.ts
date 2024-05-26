import { Block } from "./block";
import { Key } from "./key";

export class Chart{
    
    private title:string = "Title";
    private key:Key = Key.C;
    private signatureTop:number = 4;
    private signatureBottom:number = 4;
    private tempo:number = 100;
    private blocks:Block[];

    constructor(){}
}