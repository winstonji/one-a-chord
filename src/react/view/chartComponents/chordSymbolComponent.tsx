import React, { useContext, useRef, useEffect } from 'react'
import { LineElement } from '../../model/lineElement';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';
import { SelectionUtil } from '../../utils/selectionUtil';
import { ChordSymbol } from '../../model/chordSymbol';
import { FocusFinder } from '../../utils/focusFinderUtils';

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

    const updateChordSymbol = (updatedSymbol: string) => {
        // Save the cursor position before updating the state
        const cursorPosition = SelectionUtil.getCursorPos();

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
        if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
            const newFocus = lineElement.getNext();
            if (newFocus) {
                setCurrentFocus({id: newFocus.chordSymbol.id, position: newFocus.chordSymbol.backingString.length});
                event.preventDefault();
            }
        } else if (event.key === 'ArrowLeft' && (event.ctrlKey || cursorPosition === 0)) {
            const newFocus = lineElement.getPrevious();
            if (newFocus) {
                setCurrentFocus({id: newFocus.chordSymbol.id, position: newFocus.chordSymbol.backingString.length});
            } else {
                setCurrentFocus({id: lineElement.chordSymbol.id, position: 0});
            }
                event.preventDefault();
        } else if (event.key === 'ArrowUp') {
            if (event.ctrlKey) {
                const newFocus:LineElement = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'PREVIOUS_BOUNDED');
                if (newFocus) {
                    setCurrentFocus({id: newFocus.chordSymbol.id, position: newFocus.chordSymbol.backingString.length})
                }
                event.preventDefault();
                return;
            }
            const nextChordWrapper = FocusFinder.focusUpFrom(lineElement);
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.chordSymbol.id, position: 0});
            }
            event.preventDefault();
        } else if (event.key === 'ArrowDown') {
            if (event.ctrlKey) {
                const newFocus:LineElement = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'NEXT_BOUNDED');
                if (newFocus) {
                    setCurrentFocus({id: newFocus.chordSymbol.id, position: newFocus.chordSymbol.backingString.length})
                }
                event.preventDefault();
                return;
            }
            const nextChordWrapper = FocusFinder.focusDownFrom(lineElement);
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.chordSymbol.id, position: 0});
            }
            event.preventDefault();
        } else if (event.ctrlKey && event.code === 'KeyL') {
            event.preventDefault();
            const lyricSegment = lineElement.lyricSegment;
            console.log(`id: ${lyricSegment.id}`);
            setCurrentFocus({id: lyricSegment.id, position: lyricSegment.lyric.length});
        }
        
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
            onInput={(event) => {updateChordSymbol(event.currentTarget.textContent || '')}}
        >
        </div>
    );
}

export default ChordSymbolComponent;
