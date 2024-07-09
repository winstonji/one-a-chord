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

    if (event.ctrlKey && event.code === 'KeyL') {
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

function handleEditFocus(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    const lyricSegment = lineElement.lyricSegment;
    return {
        id: lyricSegment.id,
        position: lyricSegment.lyric.length
    };
}