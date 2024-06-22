import React, { useContext, useRef, useEffect } from 'react';
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { getCursorPos } from '../../utils/selectionUtil';
import { ChartService } from '../../services/chartService';

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    
    const {chartEditingState, setChartEditingState, setCurrentFocus }= useContext(ChartContext);
    const editableRef = useRef<HTMLDivElement>(null); // Ref for the contentEditable div

    const currentFocus = chartEditingState.currentFocus;

    useEffect(() => {
        // Set the initial lyric content
        if (editableRef.current) {
            editableRef.current.textContent = chordWrapper.lyricSegment;

            if(currentFocus.id === chordWrapper.id){
                editableRef.current.focus();
                
                const textNode = editableRef.current.childNodes[0];
                const selection: Selection = window.getSelection();
                const updatedPosition: Range = document.createRange();
                updatedPosition.setStart(textNode, currentFocus.position);
                updatedPosition.setEnd(textNode, currentFocus.position);
                selection.removeAllRanges();
                selection.addRange(updatedPosition);
            }
        }
    });

    const updateLyric = (updatedLyric: string) => {
        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateLyric(chordWrapper, updatedLyric);
        
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    ...chartEditingState.currentFocus,
                    position: getCursorPos()
                }
            };
        })
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const cursorPosition = getCursorPos();
        const contentLength = editableRef.current.textContent.length;
        
        if (event.key === ' ' && editableRef.current) {

            setChartEditingState((chartEditingState) => {
                const chartService = ChartService.with(chartEditingState.chart);
                const newChordWrapper = chartService.insertNewChordWrapperAfter(chordWrapper, '', cursorPosition);
            
                return {
                    chart: chartService.finalize(),
                    currentFocus: {id: newChordWrapper.id, position: 0}
                }
            });
            
            // Prevent the space from being added
            event.preventDefault();

        } else if (event.key === 'Enter' && editableRef.current) {

            setChartEditingState((chartEditingState) => {
                const chartService = ChartService.with(chartEditingState.chart);
                const newLine = chartService.insertNewLineAfter(chordWrapper, cursorPosition);

                return {
                    chart: chartService.finalize(),
                    currentFocus: {
                        id: newLine.children[0].id,
                        position: 0
                    }
                }
            })
            
            // setCurrentFocus({id: newLine.children[0].id, position: 0});
            event.preventDefault();
        } else if (event.key === 'Backspace') {
            const selection = window.getSelection();
            // Check if the cursor is at the start
            if (selection.anchorOffset === 0) {

                setChartEditingState((chartEditingState) => {

                    const cursorPositionAfterMerge = chordWrapper.getPrevious().lyricSegment.length;
                    const chartService = ChartService.with(chartEditingState.chart);
                    chartService.mergeChordWrapper(chordWrapper, -1);

                    setCurrentFocus({})
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            ...chartEditingState.currentFocus,
                            position: cursorPositionAfterMerge
                        }
                    }
                });
                event.preventDefault(); // Prevent the default backspace behavior
            }
        } else if (event.key === 'Delete') {
            const selection = window.getSelection();
            setCurrentFocus({position: cursorPosition});
            if (selection.anchorOffset === contentLength) {
                
                setChartEditingState((chartEditingState) => {

                    const cursorPositionAfterMerge = chordWrapper.getPrevious().lyricSegment.length;
                    const chartService = ChartService.with(chartEditingState.chart);
                    chartService.mergeChordWrapper(chordWrapper, 1);

                    setCurrentFocus({})
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            ...chartEditingState.currentFocus,
                            position: cursorPositionAfterMerge
                        }
                    }
                });
                event.preventDefault(); // Prevent the default delete behavior
            }
        } else if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
            const nextChordWrapper = chordWrapper.getNext();
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.id, position: 0});
                event.preventDefault();
            }
        } else if (event.key === 'ArrowLeft' && (event.ctrlKey || cursorPosition === 0)) {
            const nextChordWrapper = chordWrapper.getPrevious();
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.id, position: nextChordWrapper.lyricSegment.length});
                event.preventDefault();
            } 
        }
    };
    

    //This keeps the current focus in sync with the cursor in the DOM when you click an element.
    //Otherwise when you start typing, the cursor will jump to an incorrect position because the current focus state is wrong.
    const handleFocusViaClick = () => {
        setCurrentFocus({id: chordWrapper.id, position: getCursorPos()});
        console.log(chordWrapper.id);
    }
      
    return (
        <div
            ref={editableRef}
            className="oac-lyric-segment"
            contentEditable
            onClick={handleFocusViaClick}
            onKeyDown={handleKeyDown}
            onInput={(event) => updateLyric(event.currentTarget.textContent || '')}
        >
        </div>
    );
}

export default LyricSegmentComponent;
