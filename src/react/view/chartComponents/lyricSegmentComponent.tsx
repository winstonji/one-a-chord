import React, { useContext, useRef, useEffect } from 'react';
import { LineElement } from '../../model/lineElement';
import { ChartContext } from '../programWindow';
import { getCursorPos } from '../../utils/selectionUtil';
import { ChartService } from '../../services/chartService';

function LyricSegmentComponent(lineElement: LineElement) {
    
    const {chartEditingState, setChartEditingState, setCurrentFocus }= useContext(ChartContext);
    const editableRef = useRef<HTMLDivElement>(null); // Ref for the contentEditable div

    const currentFocus = chartEditingState.currentFocus;

    useEffect(() => {
        // Set the initial lyric content
        if (editableRef.current) {
            editableRef.current.textContent = lineElement.lyricSegment.lyric;

            if(currentFocus.id === lineElement.lyricSegment.id){
                editableRef.current.focus();
                
                const textNode = editableRef.current.childNodes[0];
                const selection: Selection = window.getSelection();
                const updatedPosition: Range = document.createRange();
                console.log()
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
            chartService.updateLyric(lineElement, updatedLyric);
        
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
                const newChordWrapper = chartService.splitChordWrapper(lineElement, '', cursorPosition);
                return {
                    chart: chartService.finalize(),
                    currentFocus: {id: newChordWrapper.lyricSegment.id, position: 0}
                }
            });
            
            // Prevent the space from being added
            event.preventDefault();

        } else if (event.key === 'Enter' && editableRef.current) {

            setChartEditingState((chartEditingState) => {
                const chartService = ChartService.with(chartEditingState.chart);
                const newLine = chartService.insertNewLineAfter(lineElement, cursorPosition);

                return {
                    chart: chartService.finalize(),
                    currentFocus: {
                        id: newLine.children[0].lyricSegment.id,
                        position: 0
                    }
                }
            })
            
            // setCurrentFocus({id: newLine.children[0].id, position: 0});
            event.preventDefault();
        } else if (event.key === 'Backspace' && cursorPosition === 0) {
            event.preventDefault();
            if (event.ctrlKey) {
                setChartEditingState((chartEditingState) => {
                    const chartService = ChartService.with(chartEditingState.chart);
                    const newFocus:LineElement = chartService.deletePrevious(lineElement);
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            id: newFocus.lyricSegment.id,
                            position: 0
                        }
                    }
                })
                return;
            }
            setChartEditingState((chartEditingState) => {

                const cursorPositionAfterMerge = lineElement.getPrevious().lyricSegment.lyric.length;
                const chartService = ChartService.with(chartEditingState.chart);
                const newFocus: LineElement = chartService.mergeLineElement(lineElement, -1);
                const lineElementIndex:number = lineElement.parent.children.findIndex((element) => element.id === lineElement.id);
                if (lineElementIndex === 0) {
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            id: newFocus.lyricSegment.id,
                            position: 0
                        }
                    }
                } else {
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            id: newFocus.lyricSegment.id,
                            position: cursorPositionAfterMerge
                        }
                    }
                }
            });
            event.preventDefault(); // Prevent the default backspace behavior
        } else if (event.key === 'Delete' && cursorPosition === lineElement.lyricSegment.lyric.length  - 1) {
            if (event.ctrlKey) {
                setChartEditingState((chartEditingState) => {
                    const chartService = ChartService.with(chartEditingState.chart);
                    const newFocus:LineElement = chartService.deleteNext(lineElement);
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            id: newFocus.lyricSegment.id,
                            position: newFocus.lyricSegment.lyric.length
                        }
                    }
                })
                return;
            }
            const selection = window.getSelection();
            setCurrentFocus({position: cursorPosition});
            if (selection.anchorOffset === contentLength) {
                
                setChartEditingState((chartEditingState) => {

                    const cursorPositionAfterMerge = lineElement.getPrevious().lyricSegment.lyric.length;
                    const chartService = ChartService.with(chartEditingState.chart);
                    chartService.mergeLineElement(lineElement, 1);

                    setCurrentFocus({})
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            ...chartEditingState.currentFocus,
                            position: cursorPositionAfterMerge
                        }
                    }
                });
            }
        } else if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
            const newFocus = lineElement.getNext();
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
                event.preventDefault();
            }
        } else if (event.key === 'ArrowLeft' && (event.ctrlKey || cursorPosition === 0)) {
            const newFocus = lineElement.getPrevious();
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
                event.preventDefault();
            } 
        } else if (event.key === 'ArrowUp') {
            let newFocus:LineElement
            if (event.ctrlKey) {
                newFocus = lineElement.getFirstInBlock();
                if (newFocus) {
                    setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length})
                }
                event.preventDefault();
                return;
            }
            newFocus = lineElement.jumpUp();
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: 0});
            }
            event.preventDefault();
        } else if (event.key === 'ArrowDown') {
            let newFocus:LineElement;
            if (event.ctrlKey) {
                newFocus = lineElement.getLastInBlock();
                if (newFocus) {
                    setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length})
                }
                event.preventDefault();
                return;
            }
            newFocus = lineElement.jumpDown();
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: 0});
            }
            event.preventDefault();
        } else if (event.ctrlKey && event.code === 'KeyK') {
            event.preventDefault();
            const chordSymbol = lineElement.chordSymbol;
            console.log(`id: ${chordSymbol.id}`);
            setCurrentFocus({id: chordSymbol.id, position:chordSymbol.backingString.length});
        }
        
    };
    

    //This keeps the current focus in sync with the cursor in the DOM when you click an element.
    //Otherwise when you start typing, the cursor will jump to an incorrect position because the current focus state is wrong.
    const handleFocusViaClick = () => {
        setCurrentFocus({id: lineElement.lyricSegment.id, position: getCursorPos()});
        console.log(lineElement.lyricSegment.id);
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
