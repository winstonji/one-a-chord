import { Block } from "../../model/block";
import { Chart } from "../../model/chart";
import { ChartMetaData } from "../../model/chartMetaData";
import { ChordWrapper } from "../../model/chordWrapper";
import { Key } from "../../model/key";
import { Line } from "../../model/line";
import { v4 as uuidv4 } from 'uuid';

export function fakeChart(): Chart{
    let testChart: Chart = new Chart();
    testChart.metaData = new ChartMetaData("Title McTitleface", Key.Ab, 3, 4, 69);

    const v1 = new Block("Verse 1", uuidv4());
    const v1l1 = new Line(v1, uuidv4());
    v1l1.children = [
        new ChordWrapper(v1l1, uuidv4(), "Gsus/B" , "Jesus"),
        new ChordWrapper(v1l1, uuidv4(), "Gsus/B" , "Jesus"),
        new ChordWrapper(v1l1, uuidv4(), "Gsus/B" , "Jesus"),
    ];
    v1.children = [v1l1];

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

    testChart.blocks = [v1, v2, v3];

    return testChart;
}
