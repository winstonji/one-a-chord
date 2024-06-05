import React, { useEffect, useState, createContext } from 'react'
import Toolbar from './globalComponents/toolbar';
import Canvas from './globalComponents/canvas';
import { Chart } from '../model/chart';
import { Key } from '../model/key';
import { ChartMetaData } from '../model/chartMetaData';

export const ChartContext = createContext(null); 

const ProgramWindow = () => {

    const [chart, setChart] = useState(generateTestChart);

	return (<ChartContext.Provider value={chart}>
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
    testChart.blocks = [
        {
            header:"Verse 1",
            lines:[
                {
                    chordWrappers:[
                        {
                            root:Key.Gs,
                            quality:"sus",
                            lyricSegment:"Jesus"
                        }
                    ]
                }
            ]
        },
        {
            header:"Verse 2",
            lines:[
                {
                    chordWrappers:[
                        {
                            root:Key.Gs,
                            quality:"sus",
                            lyricSegment:"Jesus"
                        }
                    ]
                }
            ]
        },
        {
            header:"Verse 3",
            lines:[
                {
                    chordWrappers:[
                        {
                            root:Key.Gs,
                            quality:"sus",
                            lyricSegment:"Jesus"
                        }
                    ]
                }
            ]
        }
    ];

    return testChart;
}
