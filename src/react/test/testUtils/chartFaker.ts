import { Block } from "../../model/block";
import { Chart } from "../../model/chart";
import { ChartMetaData } from "../../model/chartMetaData";
import { ChordWrapper } from "../../model/chordWrapper";
import { Key } from "../../model/key";
import { Line } from "../../model/line";
import { v4 as uuidv4 } from 'uuid';

export class FakeChart{

    public chart: Chart;

    constructor(chart){
        this.chart = chart;
    }

    public getFirstBlock(): Block | undefined{
        return this.chart?.blocks[0]
    }

    public getFirstLine(): Line | undefined{
        return this.getFirstBlock().children[0];
    }

    public getFirstChordWrapper(): ChordWrapper | undefined{
        return this.getFirstLine().children[0];
    }
}

//TODO: we should come up with a way to make this more dynamic so our tests aren't always running on the same stale data everytime.
export function generateFakeChart(): FakeChart{
    let fakeChart: Chart = new Chart();
    fakeChart.metaData = new ChartMetaData("Title McTitleface", Key.Ab, 3, 4, 69);

    const v1 = new Block("Verse 1", uuidv4());
    const v1l1 = new Line(v1, uuidv4());
    v1l1.children = [
        new ChordWrapper(v1l1, uuidv4(), "Gsus/B" , "What"),
        new ChordWrapper(v1l1, uuidv4(), "D" , "a"),
        new ChordWrapper(v1l1, uuidv4(), "Bmin" , "lyric"),
    ];
    const v1l2 = new Line(v1, uuidv4());
    v1l2.children = [
        new ChordWrapper(v1l2, uuidv4(), "G#7" , "Superlonglyricsegment"),
        new ChordWrapper(v1l2, uuidv4(), "Gbmaj7/D" , "a"),
        new ChordWrapper(v1l2, uuidv4(), "Gsus/B" , "hecking"),
        new ChordWrapper(v1l2, uuidv4(), "Gsus" , "fishy")
    ]
    const v1l3 = new Line(v1, uuidv4());
    v1l3.children = [
        new ChordWrapper(v1l3, uuidv4(), "/D" , "Just"),
        new ChordWrapper(v1l3, uuidv4(), "D#/B" , "a"),
        new ChordWrapper(v1l3, uuidv4(), "B aug 13" , "third"),
        new ChordWrapper(v1l3, uuidv4(), "G13b5/G#" , "line")
    ]
    v1.children = [v1l1, v1l2, v1l3];

    const v2 = new Block("Verse 2", uuidv4());
    const v2l1 = new Line(v2, uuidv4());
    v2l1.children = [
        new ChordWrapper(v2l1, uuidv4(), "Gsus/B" , "Jesus"),
    ];
    v2.children = [v2l1];

    const v3 = new Block("Verse 3", uuidv4());
    const v3l1 = new Line(v3, uuidv4());
    v3l1.children = [
        new ChordWrapper(v3l1, uuidv4(), "Gsus/B" , "Jesus")
    ]
    v3.children = [v3l1]

    fakeChart.blocks = [v1, v2, v3];

    return new FakeChart(fakeChart);
}
