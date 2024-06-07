import { Chart } from "../model/chart";
import { ChordWrapper } from "../model/chordWrapper";

export class ChartService {

    private setChart: React.Dispatch<React.SetStateAction<Chart>>;

    constructor(setChart: React.Dispatch<React.SetStateAction<Chart>>){
        this.setChart = setChart;
    }

    public updateLyric(lyric: string){
        this.setChart((previousChart: Chart) => ({
            ...previousChart,

            })
        )
    }

}