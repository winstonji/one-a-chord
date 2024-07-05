import React, { useContext, useRef, useEffect } from 'react';
import { LineElement } from '../../model/lineElement';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';
import { Block } from '../../model/block';
import { FocusFinder } from '../../utils/focusFinderUtils';
import { SelectionUtil } from '../../utils/selectionUtil';

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
                if (textNode) {
                    SelectionUtil.setCursorPos(textNode, currentFocus.position);
                }
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
                    position: SelectionUtil.getCursorPos()
                }
            };
        })
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const cursorPosition = SelectionUtil.getCursorPos();
        const contentLength = editableRef.current.textContent.length;
        
        if (event.key === ' ' && editableRef.current) {

            setChartEditingState((chartEditingState) => {
                const chartService = ChartService.with(chartEditingState.chart);
                const newChordWrapper = chartService.splitLineElement(lineElement, '', cursorPosition);
                return {
                    chart: chartService.finalize(),
                    currentFocus: {id: newChordWrapper.lyricSegment.id, position: 0}
                }
            });
            
            // Prevent the space from being added
            event.preventDefault();

        } else if (event.key === 'Enter' && editableRef.current) {
            if (event.ctrlKey) {
                setChartEditingState((chartEditingState) => {
                    const chartService = ChartService.with(chartEditingState.chart);
                    const newBlock:Block = chartService.insertNewBlockAfter(lineElement, cursorPosition);
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            id: newBlock.children[0].children[0].lyricSegment.id,
                            position: 0
                        }
                    }
                })
            } else {
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
            }
            event.preventDefault();
        } else if (event.key === 'Backspace' && cursorPosition === 0) {
            event.preventDefault();
            if (event.ctrlKey) {
                setChartEditingState((chartEditingState) => {
                    const chartService = ChartService.with(chartEditingState.chart);
                    chartService.deletePrevious(lineElement);
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            id: lineElement.lyricSegment.id,
                            position: 0
                        }
                    }
                })
                return;
            } else if (lineElement.getPrevious() !== null){
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
            }
        } else if (event.key === 'Delete' && cursorPosition === contentLength) {
            event.preventDefault();
            if (event.ctrlKey) {
                setChartEditingState((chartEditingState) => {
                    const chartService = ChartService.with(chartEditingState.chart);
                    chartService.deleteNext(lineElement);
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            id: lineElement.lyricSegment.id,
                            position: contentLength
                        }
                    }
                })
            } else {
                setChartEditingState((chartEditingState) => {
                    const chartService = ChartService.with(chartEditingState.chart);
                    chartService.mergeLineElement(lineElement, 1);
    
                    setCurrentFocus({})
                    return {
                        chart: chartService.finalize(),
                        currentFocus: {
                            ...chartEditingState.currentFocus,
                            position: contentLength
                        }
                    }
                });
            }
        } else if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
            const newFocus = lineElement.getNext();
            if (newFocus) {
                if (event.ctrlKey) {
                    setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
                } else {
                    setCurrentFocus({id: newFocus.lyricSegment.id, position: 0});
                }
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
                newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'PREVIOUS');
                if (newFocus) {
                    setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length})
                }
                event.preventDefault();
                return;
            }
            newFocus = FocusFinder.focusUpFrom(lineElement);
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
            }
            event.preventDefault();
        } else if (event.key === 'ArrowDown') {
            let newFocus:LineElement;
            if (event.ctrlKey) {
                newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'NEXT');
                if (newFocus) {
                    setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length})
                }
                event.preventDefault();
                return;
            }
            newFocus = FocusFinder.focusDownFrom(lineElement);
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
            }
            event.preventDefault();
        } else if (event.code === 'Home') {
            let newFocus:LineElement;
            if (event.ctrlKey) {
                newFocus = FocusFinder.focusChartStart(chartEditingState.chart);
            } else {
                newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'PREVIOUS_BOUNDED');
            }
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: 0});
            }
        } else if (event.code === 'End') {
            let newFocus:LineElement;
            if (event.ctrlKey) {
                newFocus = FocusFinder.focusChartEnd(chartEditingState.chart);
            } else {
                newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'NEXT_BOUNDED');
            }
            if (newFocus) {
                setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
            }
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
        console.log(lineElement.id);
        setCurrentFocus({id: lineElement.lyricSegment.id, position: SelectionUtil.getCursorPos()});
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
