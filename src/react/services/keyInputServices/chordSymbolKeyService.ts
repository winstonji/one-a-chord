import { LineElement } from "../../model/lineElement";
import { ChartEditingState } from "../../view/types/chartContext";
import { LineElementKeyService } from "./lineElementKeyService";

export interface ChordSymbolKeyServiceResult{
    updated: boolean,
    chartEditingState?: ChartEditingState
}

export function handleChordSymbolKeyDown(
    event: React.KeyboardEvent,
    chartEditingState: ChartEditingState,
    lineElement: LineElement,
    cursorPosition: number,
    contentLength: number
): ChordSymbolKeyServiceResult{
    
    let updateResult;

    if (event.key === 'Tab') {
        updateResult = {
            chart: {...chartEditingState.chart},
            currentFocus: handleTab(event, lineElement)
        }
    }
    else if (event.ctrlKey && event.code === 'KeyL') {
        updateResult = {
            chart: {...chartEditingState.chart},
            currentFocus: handleEditFocus(event, lineElement)
        }
    } else {
        const lineElementKeyService = new LineElementKeyService('CHORD');
        const result = lineElementKeyService.handleLineElementKeyDown(
            event,
            chartEditingState,
            lineElement,
            cursorPosition,
            contentLength
        );

        if(result.updated){
            updateResult = {
                chart: {...chartEditingState.chart},
                currentFocus: result.focus!
            }
        }
    }

    if(updateResult){
        return {
            updated: true,
            chartEditingState: {...updateResult}
        }
    }

    return {updated: false}
}

function handleTab(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    let newFocus;
    if (event.shiftKey) {
        newFocus = lineElement.getPreviousWithChord();
        return {
            id: newFocus.chordSymbol.id,
            position: newFocus.chordSymbol.backingString.length
        }
    } else {
        newFocus = lineElement.getNextWithChord();
        return {
            id: newFocus.chordSymbol.id,
            position: newFocus.chordSymbol.backingString.length
        }
    }
}

function handleEditFocus(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    const lyricSegment = lineElement.lyricSegment;
    return {
        id: lyricSegment.id,
        position: lyricSegment.lyric.length
    };
}