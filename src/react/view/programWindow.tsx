import React, { useEffect, useState, createContext } from 'react'
import Toolbar from './globalComponents/toolbar';
import Canvas from './globalComponents/canvas';
import { Chart } from '../model/chart';
import { Key } from '../model/key';
import { ChartMetaData } from '../model/chartMetaData';

export const ChartContext = createContext(null); 

const ProgramWindow = () => {


	return (<ChartContext.Provider value={generateTestChart()}>
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
    testChart.metaData = new ChartMetaData();
    testChart.blocks = [
        {
            header:"Verse 1",
            lines:[
                {
                    chordWrappers:[
                        {
                            chord:Key.Gs,
                            quality:"sus",
                            lyricSegment:"Jesus"
                        }
                    ]
                }
            ]
        },
        {
            header:"Verse 1",
            lines:[
                {
                    chordWrappers:[
                        {
                            chord:Key.Gs,
                            quality:"sus",
                            lyricSegment:"Jesus"
                        }
                    ]
                }
            ]
        },
        {
            header:"Verse 1",
            lines:[
                {
                    chordWrappers:[
                        {
                            chord:Key.Gs,
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
