import React, { useEffect, useState, useRef, createContext } from 'react'
import Toolbar from './globalComponents/toolbar';
import Canvas from './globalComponents/canvas';
import { Chart } from '../model/chart';
import { generateFakeChart } from '../test/testUtils/chartFaker';
import { ChartEditingState, IChartContext, } from './types/chartContext';
import { CurrentFocus, UpdateCurrentFocusProps } from './types/currentFocus';
import { UndoWrapper } from '../model/interfaces/undoWrapper';
import isEqual from 'lodash/isEqual';
import { KeyServiceResult } from '../services/interfaces/keyServiceResult';
import { optionalSpread } from '../utils/optionalSpread';

export const ChartContext = createContext<IChartContext>(null); 

const ProgramWindow = () => {

    const [chartEditingState, setChartEditingState] = useState<ChartEditingState>((): ChartEditingState => {
        const chart: Chart = generateFakeChart().chart;

        //default focus to first chord wrapper in the chart.
        const currentFocus: CurrentFocus = {
            id: chart.children[0].children[0].children[0].id,
            position: 0
        };

        return {chart, currentFocus} as ChartEditingState;
    });

    const undoRef = useRef<UndoWrapper>({undoStack:[], redoStack:[]});
    useEffect(() => {
        const undoTimeout = setTimeout(() => {
            const {dirtyState, undoStack} = undoRef.current;
            if(dirtyState){
                console.log('updating dirty state');
                undoStack.push(dirtyState);
                undoRef.current.dirtyState = undefined;
            }
        }, 1000);

        return () => {
            clearTimeout(undoTimeout);
        }
    });
    
    /**
     * A helper to update only the focus and not the chart data.
     * @param newFocusVal The new fields to set on the focus object. Matches the shape of CurrentFocus but with optional fields. Any fields not specified will not be changed.
     */
    function currentFocusHelper(newFocusVal: UpdateCurrentFocusProps){
        setChartEditingState((chartEditingState) => {
            return {
                ...chartEditingState,
                currentFocus: {
                    id: newFocusVal.id ?? chartEditingState.currentFocus.id,
                    position: newFocusVal.position ?? chartEditingState.currentFocus.position
                }
            }
        })
    }

    function setChartEditingStateProcessor(editorFunction: (chartEditingState: ChartEditingState) => KeyServiceResult){
        setChartEditingState((chartEditingState) => {
            const result: KeyServiceResult | undefined = editorFunction(chartEditingState);
            
            if(result?.chart && !undoRef.current.dirtyState){
                undoRef.current.dirtyState = {...chartEditingState};
            }

            //Only update the react state if the focus or the chart contents (or both) changed. Otherwise there is no reason to re-render.
            return result? optionalSpread(chartEditingState, result): chartEditingState;
        })
    }

	return (
        <>
        {chartEditingState && 
            <ChartContext.Provider value={{chartEditingState, setChartEditingState: setChartEditingStateProcessor, setCurrentFocus: currentFocusHelper, undoRef}}>
                {<>
                    <Toolbar/>
                    <Canvas/>
                </>}
                {/* You can remove this line if you don't need to debug if the chart state is updating */}
                <pre>{stringifyWithCircularForHTML(chartEditingState.chart)}</pre>
            </ChartContext.Provider>
        }
        </>
    );
}

export default ProgramWindow;

//Generated by chatGPT to print the chart object with it's circular dependencies.
function stringifyWithCircularForHTML(obj: Chart) {
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
