import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { LineElement } from "../../model/lineElement";
import { ChartEditingState } from "../../view/types/chartContext";
import { GlobalKeyService } from "./globalKeyService";
import { LineElementKeyService } from "./lineElementKeyService";

export interface ChordSymbolKeyServiceResult{
    updated: boolean,
    chartEditingState?: ChartEditingState
}

export class ChordSymbolKeyService{

    private chartEditingState: ChartEditingState;
    private undoWrapper: UndoWrapper;

    public constructor(chartEditingState: ChartEditingState, undoWrapper: UndoWrapper){
        this.chartEditingState = chartEditingState;    
        this.undoWrapper = undoWrapper;
    }

    public handleChordSymbolKeyDown(
        event: React.KeyboardEvent,
        lineElement: LineElement,
        cursorPosition: number,
        contentLength: number
    ): ChordSymbolKeyServiceResult{
        
        const globalKeyService = new GlobalKeyService(this.chartEditingState, this.undoWrapper);
        const result = globalKeyService.handleGlobalKeyDown(event);
        if(result.updated){
            return result;
        }

        let updateResult;
    
        if (event.key === 'Tab') {
            updateResult = {
                chart: {...this.chartEditingState.chart},
                currentFocus: this.handleTab(event, lineElement)
            }
        }
        else if (event.ctrlKey && event.code === 'KeyL') {
            updateResult = {
                chart: {...this.chartEditingState.chart},
                currentFocus: this.handleEditFocus(event, lineElement)
            }
        } else {
            const lineElementKeyService = new LineElementKeyService('CHORD', this.chartEditingState, this.undoWrapper);
            const result = lineElementKeyService.handleLineElementKeyDown(
                event,
                lineElement,
                cursorPosition,
                contentLength
            );
    
            if(result.updated){
                updateResult = {
                    chart: {...this.chartEditingState.chart},
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
    
    private handleTab(event:React.KeyboardEvent, lineElement:LineElement){
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
    
    private handleEditFocus(event:React.KeyboardEvent, lineElement:LineElement){
        event.preventDefault();
        const lyricSegment = lineElement.lyricSegment;
        return {
            id: lyricSegment.id,
            position: lyricSegment.lyric.length
        };
    }
}
