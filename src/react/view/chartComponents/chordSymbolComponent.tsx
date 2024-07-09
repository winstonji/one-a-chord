import React, { useContext, useRef, useEffect } from 'react'
import { LineElement } from '../../model/lineElement';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';
import { SelectionUtil } from '../../utils/selectionUtil';
import { handleChordSymbolKeyDown } from '../../services/keyInputServices/chordSymbolKeyService';

function ChordSymbolComponent(lineElement: LineElement) {

    const {chartEditingState, setChartEditingState, setCurrentFocus }= useContext(ChartContext);
    const editableRef = useRef(null); // Ref for the contentEditable div

    const currentFocus = chartEditingState.currentFocus;

    useEffect(() => {
        
        // Set the initial chord symbol content
        if (editableRef.current) {
            editableRef.current.textContent = lineElement.chordSymbol.backingString;
        }

        if(currentFocus.id === lineElement.chordSymbol.id){
            editableRef.current.focus();
            
            const textNode = editableRef.current.childNodes[0];
            if (textNode) {
               SelectionUtil.setCursorPos(textNode, currentFocus.position);
            }
        }
    });

    const updateChord = (updatedSymbol: string) => {
        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateChord(lineElement, updatedSymbol);

            return {
                chart: chartService.finalize(),
                currentFocus: {
                    ...chartEditingState.currentFocus,
                    position: SelectionUtil.getCursorPos()
                }
            };
        })
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const cursorPosition = SelectionUtil.getCursorPos();
        const contentLength = editableRef.current.textContent.length;    

        setChartEditingState((chartEditingState) => {
            const updateResult = handleChordSymbolKeyDown(event,
                                             chartEditingState,
                                             lineElement,
                                             cursorPosition,
                                             contentLength
                                        );

            //Only update the react state if the focus or the chart contents (or both) changed. Otherwise there is no reason to re-render.
            if(updateResult.updated){
                return updateResult.chartEditingState
            }

            return chartEditingState;
        });
    };
    
    //This keeps the current focus in sync with the cursor in the DOM when you click an element.
    //Otherwise when you start typing, the cursor will jump to an incorrect position because the current focus state is wrong.
    const handleFocusViaClick = () => {
        setCurrentFocus({id: lineElement.chordSymbol.id, position: SelectionUtil.getCursorPos()});
        console.log(lineElement.id);
    }

    return (
        <div
            ref={editableRef}
            className="oac-chord-symbol"
            contentEditable
            onClick={handleFocusViaClick}
            onKeyDown={handleKeyDown}
            onInput={(event) => {updateChord(event.currentTarget.textContent || '')}}
        >
        </div>
    );
}

export default ChordSymbolComponent;
