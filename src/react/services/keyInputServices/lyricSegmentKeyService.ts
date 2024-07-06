import { Block } from "typescript";
import { ChartService } from "../chartService";
import { ChartEditingState } from "../../view/types/chartContext";
import { LineElement } from "../../model/lineElement";
import { Chart } from "../../model/chart";

export function handleLyricSegmentKeyDown(
    event: React.KeyboardEvent,
    chartEditingState: ChartEditingState,
    lineElement: LineElement,
    cursorPosition: number,
    contentLength: number
): ChartEditingState{
    if (event.key === ' ') {
        return handleSpace(chartEditingState.chart, lineElement, cursorPosition);
    } else if (event.key === 'Enter') {
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
    
    } else if (event.ctrlKey && event.code === 'KeyK') {
        event.preventDefault();
        const chordSymbol = lineElement.chordSymbol;
        console.log(`id: ${chordSymbol.id}`);
        setCurrentFocus({id: chordSymbol.id, position:chordSymbol.backingString.length});
    }
    else{
        return lineElementKeyService.processKeys();
    }
    
}

function handleSpace(chart:Chart, lineElement, cursorPosition){
    event.preventDefault();
    const chartService = ChartService.with(chart);
    const newChordWrapper = chartService.splitLineElement(lineElement, '', cursorPosition);

    return {
        chart: chartService.finalize(),
        currentFocus: {id: newChordWrapper.lyricSegment.id, position: 0}
    }
}

function handleEnter(){

}

function handleBackspace(){

}

function handleDelete(){

}

function handleEditFocus(){

}