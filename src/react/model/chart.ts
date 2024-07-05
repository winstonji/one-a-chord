import { Block } from "./block";
import { ChartMetaData } from "./chartMetaData";
import { Identifiable } from "./interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';

export class Chart {
    
    public metaData: ChartMetaData;
    public children?:Block[];

    constructor(){}
}