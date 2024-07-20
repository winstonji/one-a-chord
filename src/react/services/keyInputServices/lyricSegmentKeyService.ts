import { ChartService } from "../chartService";
import { ChartEditingState } from "../../view/types/chartContext";
import { LineElement } from "../../model/lineElement";
import { Chart } from "../../model/chart";
import { Block } from "../../model/block";
import { LineElementKeyService } from "./lineElementKeyService";
import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { GlobalKeyService } from "./globalKeyService";
import { KeyServiceResult } from "../interfaces/keyServiceResult";

export class LyricSegmentKeyService {

    private chartEditingState: ChartEditingState;
    private undoWrapper: UndoWrapper

    public constructor(chartEditingState: ChartEditingState, undoWrapper:UndoWrapper){
        this.chartEditingState = chartEditingState;
        this.undoWrapper = undoWrapper;
    }

    public handleLyricSegmentKeyDown(
        event: React.KeyboardEvent,
        lineElement: LineElement,
        cursorPosition: number,
        contentLength: number
    ): KeyServiceResult | undefined{
        const globalKeyService = new GlobalKeyService(this.chartEditingState, this.undoWrapper);
        let result: KeyServiceResult | undefined = globalKeyService.handleGlobalKeyDown(event);

        if(result){
            return result;
        }

        if (event.key === ' ') {
            result = this.handleSpace(
                event,
                this.chartEditingState.chart,
                lineElement,
                cursorPosition
            );
        } else if (event.key === 'Enter') {
            result = this.handleEnter(
                event,
                this.chartEditingState.chart,
                lineElement,
                cursorPosition
            );
        } else if (event.key === 'Backspace' && cursorPosition === 0) {
            result = this.handleBackspace(
                event,
                lineElement
            );
        } else if (event.key === 'Delete' && cursorPosition === contentLength) {
            result = this.handleDelete(
                event,
                lineElement,
                contentLength
            );
        } else if (event.ctrlKey && event.code === 'KeyK') {
            result = {
                chart: {...this.chartEditingState.chart},
                currentFocus: this.handleEditFocus(event, lineElement)
            }
        } else {
            const lineElementKeyService = new LineElementKeyService('LYRIC', this.chartEditingState);
            const lineResult = lineElementKeyService.handleLineElementKeyDown(
                    event,
                    lineElement,
                    cursorPosition,
                    contentLength
                );
    
            if(lineResult){
                result = {
                    chart: {...this.chartEditingState.chart},
                    ...lineResult
                }
            }
        }
    
        return result;
    }
    
    private handleSpace(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement, cursorPosition:number){
        event.preventDefault();
        const chartService = ChartService.with(chart);
        const newChordWrapper = chartService.splitLineElement(lineElement, '', cursorPosition);
    
        return {
            chart: chartService.finalize(),
            currentFocus: {id: newChordWrapper.lyricSegment.id, position: 0}
        }
    }
    
    private handleEnter(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement, cursorPosition:number): ChartEditingState{
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
    
    private handleBackspace(event:React.KeyboardEvent, lineElement:LineElement): ChartEditingState | undefined{
        event.preventDefault();
        if (event.ctrlKey) {
            const chartService = ChartService.with(this.chartEditingState.chart);
            const changed = chartService.deletePrevious(lineElement);
            if(!changed){
                return undefined;
            }
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    id: lineElement.lyricSegment.id,
                    position: 0
                }
            }
        } else if (lineElement.getPrevious()){
            const chartService = ChartService.with(this.chartEditingState.chart);
            const newFocus: LineElement = chartService.mergeLineElement(lineElement, -1);
            const lineElementIndex:number = lineElement.parent.children.findIndex((element) => element.id === lineElement.id);
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    id: newFocus.lyricSegment.id,
                    position: lineElementIndex === 0? 0: lineElement.getPrevious().lyricSegment.lyric.length
                }
            }
        } 

        return {
            chart: this.chartEditingState.chart,
            currentFocus: {
                id: lineElement.id,
                position: 0
            }
        }
    }
    
    private handleDelete(event:React.KeyboardEvent, lineElement:LineElement, contentLength:number): ChartEditingState | undefined{
        event.preventDefault();
        if (event.ctrlKey) {
            const chartService = ChartService.with(this.chartEditingState.chart);
            const changed = chartService.deleteNext(lineElement);
            if(!changed){
                return undefined;
            }
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    id: lineElement.lyricSegment.id,
                    position: contentLength
                }
            }
        } else if(lineElement.getNext()){
            const chartService = ChartService.with(this.chartEditingState.chart);
            chartService.mergeLineElement(lineElement, 1);
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    ...this.chartEditingState.currentFocus,
                    position: contentLength
                }
            }
        }

        return {
            chart: this.chartEditingState.chart,
            currentFocus: {
                id: lineElement.id,
                position: contentLength
            }
        }
    }
    
    private handleEditFocus(event:React.KeyboardEvent, lineElement:LineElement){
        event.preventDefault();
        const chordSymbol = lineElement.chordSymbol;
        return {
            id: chordSymbol.id,
            position:chordSymbol.backingString.length
        };
    }
}
