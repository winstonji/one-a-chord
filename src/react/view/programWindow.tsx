import React, { useEffect, useState, createContext, useRef } from 'react'
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

export interface FocusRef{
    id: string;
    position: number;
}

export interface ChartContextType {
    chart: Chart;
    chartService: ChartService;
    focusRef: React.MutableRefObject<FocusRef>
}

export const ChartContext = createContext<ChartContextType>(null); 

const ProgramWindow = () => {

    const [chart, setChart] = useState<Chart | undefined>();
    const chartService = new ChartService(setChart);
    const focusRef = useRef<FocusRef>();

    useEffect(() => {
        const initialChart = generateTestChart();
        focusRef.current = {
            id: initialChart.blocks[0].children[0].children[0].id,
            position: 0
        };
        console.log(`Initial focus ${focusRef.current.id}`)
        setChart(initialChart);
    }, [])
    

    const id = uuidv4();

	return (
        <>
        {chart && 
            <ChartContext.Provider value={{chart, chartService, focusRef}}>
                {<>
                    <Toolbar/>
                    <Canvas/>
                </>}
                {/* You can remove this line if you don't need to debug if the chart state is updating */}
                <pre>{stringifyWithCircularForHTML(chart)}</pre>
            </ChartContext.Provider>
        }
        </>
    );
}

export default ProgramWindow;

//Generated by chatGPT to print the chart object with it's circular dependencies.
function stringifyWithCircularForHTML(obj) {
    const seen = new WeakSet();
    const jsonString = JSON.stringify(obj, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular Reference]';
            }
            seen.add(value);
        }
        return value;
    }, 2); // Add indentation for pretty printing

    return `${jsonString}`;
}

function generateTestChart(): Chart{
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
