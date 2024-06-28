import React, { useContext, useRef, useEffect } from 'react'
import { LineElement } from '../../model/lineElement';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';
import { getCursorPos } from '../../utils/selectionUtil';

function ChordSymbolComponent(chordWrapper: LineElement) {

    const {setChartEditingState} = useContext(ChartContext);
    const editableRef = useRef(null); // Ref for the contentEditable div

    useEffect(() => {
        // Set the initial chord symbol content
        if (editableRef.current) {
            editableRef.current.textContent = chordWrapper.backingString;
        }
    }, [chordWrapper.backingString]);

    const updateChordSymbol = (updatedSymbol: string) => {
        // Save the cursor position before updating the state
        const cursorPosition = getCursorPos();

        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateChord(chordWrapper, updatedSymbol);

            return {
                ...chartEditingState,
                chart: chartService.finalize(),
            }
        })
    }; 

    return (
        <div
            ref={editableRef}
            className="oac-chord-symbol"
            contentEditable
            onInput={(event) => {updateChordSymbol(event.currentTarget.textContent || '')}}
        >
        </div>
    );
}

export default ChordSymbolComponent;
