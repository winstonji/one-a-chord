import React, { useEffect, useState, createContext } from 'react'
import Toolbar from './globalComponents/toolbar';
import Canvas from './globalComponents/canvas';
import { Chart } from '../model/chart';
import { Key } from '../model/key';
import { ChartMetaData } from '../model/chartMetaData';
import { ChordWrapper } from '../model/chordWrapper';
import { ChartService } from '../services/chartService';
import { v4 as uuidv4 } from 'uuid';
import { Line } from '../model/line';
import { Block } from '../model/block';

export const ChartContext = createContext(null); 

const ProgramWindow = () => {

    const [chart, setChart] = useState(generateTestChart);
    const chartService = new ChartService(setChart);

    const id = uuidv4();

	return (<ChartContext.Provider value={{chart, chartService}}>
        {
          <>
            <Toolbar/>
            <Canvas/>
          </>   
        }
            
        </ChartContext.Provider>
    );
}

export default ProgramWindow;


function generateTestChart(): Chart{
    let testChart: Chart = new Chart();
    testChart.metaData = new ChartMetaData("Title McTitleface", Key.Ab, 3, 4, 69);

    const v1 = new Block("Verse 1");
    const v1l1 = new Line(v1);
    v1l1.chordWrappers = [
        new ChordWrapper(v1l1, Key.Gs, "sus", "", Key.Bs, "Jesus"),
        new ChordWrapper(v1l1, Key.Gs, "sus", "", Key.Bs, "Jesus"),
        new ChordWrapper(v1l1, Key.Gs, "sus", "", Key.Bs, "Jesus"),
    ];
    v1.lines = [v1l1];

    const v2 = new Block("Verse 2");
    const v2l1 = new Line(v2);
    v2l1.chordWrappers = [
        new ChordWrapper(v2l1, Key.Gs, "sus", "", Key.Bs, "Jesus"),
    ];
    v2.lines = [v2l1];

    const v3 = new Block("Verse 3");
    const v3l1 = new Line(v3);
    v3l1.chordWrappers = [
        new ChordWrapper(v3l1, Key.Gs, "sus", "", Key.Bs, "Jesus"),
    ]

    testChart.blocks = [v1, v2, v3];

    return testChart;
}
