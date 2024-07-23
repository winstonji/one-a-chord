import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { LineElement } from "../../model/lineElement";
import { ChartEditingState } from "../../view/types/chartContext";
import { KeyServiceResult } from "../interfaces/keyServiceResult";
import { GlobalKeyService } from "./globalKeyService";
import { LineElementKeyService } from "./lineElementKeyService";

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
    ): KeyServiceResult | undefined {
        
        const globalKeyService = new GlobalKeyService(this.chartEditingState, this.undoWrapper);
        let result = globalKeyService.handleGlobalKeyDown(event);
        if(result){
            return result;
        }
    
        if (event.key === 'Tab') {
            result = {
                chart: {...this.chartEditingState.chart},
                currentFocus: this.handleTab(event, lineElement)
            }
        }
        else if (event.ctrlKey && event.code === 'KeyL') {
            result = {
                chart: {...this.chartEditingState.chart},
                currentFocus: this.handleEditFocus(event, lineElement)
            }
        } else {
            const lineElementKeyService = new LineElementKeyService('CHORD', this.chartEditingState);
            const lineResult = lineElementKeyService.handleLineElementKeyDown(
                event,
                lineElement,
                cursorPosition,
                contentLength
            );
    
            if(result){
                result = {
                    chart: {...this.chartEditingState.chart},
                    ...lineResult
                }
            }
        }
    
        return result;
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
