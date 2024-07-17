import { Chart } from "../../model/chart";
import { LineElement } from "../../model/lineElement";
import { FocusFinder } from "../../utils/focusFinderUtils";
import { ChartEditingState } from "../../view/types/chartContext";
import { CurrentFocus } from "../../view/types/currentFocus";
import { KeyServiceResult } from "../interfaces/keyServiceResult";

type LineEditMode = 'CHORD' | 'LYRIC'

export class LineElementKeyService {

    private editMode:LineEditMode;
    private chartEditingState: ChartEditingState

    constructor(mode:LineEditMode, chartEditingState: ChartEditingState){
        this.editMode = mode;
        this.chartEditingState = chartEditingState;
    }

    public handleLineElementKeyDown(
        event: React.KeyboardEvent,
        lineElement: LineElement,
        cursorPosition: number,
        contentLength: number
    ): KeyServiceResult | undefined{
        
        let updatedFocus: CurrentFocus;
        if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
            updatedFocus = this.handleArrowRight(event, lineElement);
        } else if (event.key === 'ArrowLeft' && (event.ctrlKey || cursorPosition === 0)) {
            updatedFocus = this.handleArrowLeft(event, lineElement);
        } else if (event.key === 'ArrowUp') {
            updatedFocus = this.handleArrowUp(event, lineElement);
        } else if (event.key === 'ArrowDown') {
            updatedFocus = this.handleArrowDown(event, lineElement);
        } else if (event.code === 'Home') {
            updatedFocus = this.handleHomeKey(event, this.chartEditingState.chart, lineElement);
        } else if (event.code === 'End') {
            updatedFocus = this.handleEndKey(event, this.chartEditingState.chart, lineElement);
        }
            
        if(updatedFocus){
            return {
                currentFocus: updatedFocus
            }
        }

        return undefined
    }
    
    private handleArrowRight(event:React.KeyboardEvent, lineElement:LineElement): CurrentFocus | undefined{
        event.preventDefault();
        const newFocus = lineElement.getNext();
        if (newFocus) {
            return{
                ...this.discernFocus(this.editMode, newFocus), 
                position: 0
            };
        }

        return undefined;
    }
    
    private handleArrowLeft(event:React.KeyboardEvent, lineElement:LineElement): CurrentFocus | undefined{
        event.preventDefault();
        const newFocus = lineElement.getPrevious();
        if (newFocus) {
            return this.discernFocus(this.editMode, newFocus);
        }

        return undefined;
    }
    
    private handleArrowUp(event:React.KeyboardEvent, lineElement:LineElement): CurrentFocus{
        event.preventDefault();
        let newFocus:LineElement
        if (event.ctrlKey) {
            newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'PREVIOUS');
        } else {
            newFocus = FocusFinder.focusUpFrom(lineElement);
        }
    
        return this.discernFocus(this.editMode, newFocus)
    }
    
    private handleArrowDown(event:React.KeyboardEvent, lineElement:LineElement): CurrentFocus{
        event.preventDefault();
        let newFocus:LineElement
        if (event.ctrlKey) {
            newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'NEXT');
        } else {
            newFocus = FocusFinder.focusDownFrom(lineElement);
        }
    
        return this.discernFocus(this.editMode, newFocus)
    }
    
    private handleHomeKey(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement): CurrentFocus | undefined{
        let newFocus:LineElement;
        if (event.ctrlKey) {
            newFocus = FocusFinder.focusChartStart(chart);
        } else {
            newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'PREVIOUS_BOUNDED');
        }
        if (newFocus) {
            return {
                ...this.discernFocus(this.editMode, newFocus),
                position: 0
            }
        }

        return undefined;
    }
    
    private handleEndKey(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement){
        let newFocus:LineElement;
        if (event.ctrlKey) {
            newFocus = FocusFinder.focusChartEnd(chart);
        } else {
            newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'NEXT_BOUNDED');
        }
        if (newFocus) {
            return{...this.discernFocus(this.editMode, newFocus)}
        }

        return undefined;
    }

   

    private discernFocus(mode:LineEditMode, lineElement:LineElement): CurrentFocus{
        if (mode === 'CHORD') {
            return {
                id: lineElement.chordSymbol.id,
                position: lineElement.chordSymbol.backingString.length
            }
        } else if (mode === 'LYRIC') {
            return {
                id: lineElement.lyricSegment.id,
                position: lineElement.lyricSegment.lyric.length
            }
        }

        throw new Error(`Unknown mode ${mode} provided`)
    }
}