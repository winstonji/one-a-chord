import { ChartService } from "../chartService";
import { ChartEditingState } from "../../view/types/chartContext";
import { LineElement } from "../../model/lineElement";
import { Chart } from "../../model/chart";
import { Block } from "../../model/block";
import { Line } from "../../model/line";
import { handleLineElementKeyDown } from "./lineElementKeyService";

export function handleLyricSegmentKeyDown(
    event: React.KeyboardEvent,
    chartEditingState: ChartEditingState,
    lineElement: LineElement,
    cursorPosition: number,
    contentLength: number
): ChartEditingState{
    if (event.key === ' ') {
        return handleSpace(
            event,
            chartEditingState.chart,
            lineElement,
            cursorPosition
        );
    } else if (event.key === 'Enter') {
        return handleEnter(
            event,
            chartEditingState.chart,
            lineElement,
            cursorPosition
        );
    } else if (event.key === 'Backspace' && cursorPosition === 0) {
        return handleBackspace(
            event,
            chartEditingState.chart,
            lineElement
        );
    } else if (event.key === 'Delete' && cursorPosition === contentLength) {
        return handleDelete(
            event,
            chartEditingState,
            lineElement,
            contentLength
        );
    } else if (event.ctrlKey && event.code === 'KeyK') {
        return {
            chart: {...chartEditingState.chart},
            currentFocus: handleEditFocus(event, lineElement)
        }
    } else {
        return {
            chart: {...chartEditingState.chart},
            currentFocus: handleLineElementKeyDown(
                event,
                chartEditingState,
                lineElement,
                cursorPosition,
                contentLength
            )
        }
    }
    
}

function handleSpace(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement, cursorPosition:number){
    event.preventDefault();
    const chartService = ChartService.with(chart);
    const newChordWrapper = chartService.splitLineElement(lineElement, '', cursorPosition);

    return {
        chart: chartService.finalize(),
        currentFocus: {id: newChordWrapper.lyricSegment.id, position: 0}
    }
}

function handleEnter(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement, cursorPosition:number){
    event.preventDefault();
    if (event.ctrlKey) {
        const chartService = ChartService.with(chart);
        const newBlock:Block = chartService.insertNewBlockAfter(lineElement, cursorPosition);
        return {
            chart: chartService.finalize(),
            currentFocus: {
                id: newBlock.children[0].children[0].lyricSegment.id,
                position: 0
            }
        }
    } else {
        const chartService = ChartService.with(chart);
        const newLine = chartService.insertNewLineAfter(lineElement, cursorPosition);

        return {
            chart: chartService.finalize(),
            currentFocus: {
                id: newLine.children[0].lyricSegment.id,
                position: 0
            }
        }
    }
}

function handleBackspace(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement){
    event.preventDefault();
    if (event.ctrlKey) {
        const chartService = ChartService.with(chart);
        chartService.deletePrevious(lineElement);
        return {
            chart: chartService.finalize(),
            currentFocus: {
                id: lineElement.lyricSegment.id,
                position: 0
            }
        }
    } else if (lineElement.getPrevious() !== null){
        const cursorPositionAfterMerge = lineElement.getPrevious().lyricSegment.lyric.length;
        const chartService = ChartService.with(chart);
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
    }
}

function handleDelete(event:React.KeyboardEvent, chartEditingState:ChartEditingState, lineElement:LineElement, contentLength:number){
    event.preventDefault();
    if (event.ctrlKey) {
        const chartService = ChartService.with(chartEditingState.chart);
        chartService.deleteNext(lineElement);
        return {
            chart: chartService.finalize(),
            currentFocus: {
                id: lineElement.lyricSegment.id,
                position: contentLength
            }
        }
    } else {
        const chartService = ChartService.with(chartEditingState.chart);
        chartService.mergeLineElement(lineElement, 1);
        return {
            chart: chartService.finalize(),
            currentFocus: {
                ...chartEditingState.currentFocus,
                position: contentLength
            }
        }
    }
}

function handleEditFocus(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    const chordSymbol = lineElement.chordSymbol;
    console.log(`id: ${chordSymbol.id}`);
    return {
        id: chordSymbol.id,
        position:chordSymbol.backingString.length
    };
}