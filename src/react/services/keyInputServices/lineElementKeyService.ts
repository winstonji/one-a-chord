import { Chart } from "../../model/chart";
import { Line } from "../../model/line";
import { LineElement } from "../../model/lineElement";
import { FocusFinder } from "../../utils/focusFinderUtils";
import { ChartEditingState } from "../../view/types/chartContext";
import { CurrentFocus } from "../../view/types/currentFocus";

export function handleLineElementKeyDown(
    event: React.KeyboardEvent,
    chartEditingState: ChartEditingState,
    lineElement: LineElement,
    cursorPosition: number,
    contentLength: number
): CurrentFocus {
    if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
        return handleArrowRight(event, lineElement);
    } else if (event.key === 'ArrowLeft' && (event.ctrlKey || cursorPosition === 0)) {
        return handleArrowLeft(event, lineElement);
    } else if (event.key === 'ArrowUp') {
        return handleArrowUp(event, lineElement);
    } else if (event.key === 'ArrowDown') {
        return handleArrowDown(event, lineElement);
    } else if (event.code === 'Home') {
        return handleHomeKey(event, chartEditingState.chart, lineElement);
    } else if (event.code === 'End') {
        return handleEndKey(event, chartEditingState.chart, lineElement);
    }
}

function handleArrowRight(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    const newFocus = lineElement.getNext();
    if (newFocus) {
        return{id: newFocus.lyricSegment.id, position: 0};
    }
}

function handleArrowLeft(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    const newFocus = lineElement.getNext();
    if (newFocus) {
        return{id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length};
    }
}

function handleArrowUp(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    let newFocus:LineElement
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'PREVIOUS');
    } else {
        newFocus = FocusFinder.focusUpFrom(lineElement);
    }

    return {
        id: newFocus.lyricSegment.id,
        position: newFocus.lyricSegment.lyric.length
    }
}

function handleArrowDown(event:React.KeyboardEvent, lineElement:LineElement){
    event.preventDefault();
    let newFocus:LineElement
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'NEXT');
    } else {
        newFocus = FocusFinder.focusDownFrom(lineElement);
    }

    return {
        id: newFocus.lyricSegment.id,
        position: newFocus.lyricSegment.lyric.length
    }
}

function handleHomeKey(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement){
    let newFocus:LineElement;
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusChartStart(chart);
    } else {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'PREVIOUS_BOUNDED');
    }
    if (newFocus) {
        return {
            id: newFocus.lyricSegment.id,
            position: 0
        }
    }
}

function handleEndKey(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement){
    let newFocus:LineElement;
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusChartEnd(chart);
    } else {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'NEXT_BOUNDED');
    }
    if (newFocus) {
        return{
            id: newFocus.lyricSegment.id,
            position: newFocus.lyricSegment.lyric.length
        }
    }
}