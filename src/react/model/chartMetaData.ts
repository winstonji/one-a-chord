import { Key, KeyValue } from "./key";

export class ChartMetaData{
    public title:string = "Title";
    public keyValue:KeyValue = Key.Cs;
    public signatureTop:number = 4;
    public signatureBottom:number = 4;
    public tempo?:number = 100;
}