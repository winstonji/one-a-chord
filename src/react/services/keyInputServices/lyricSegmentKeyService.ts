import { ChartService } from "../chartService";
import { ChartEditingState } from "../../view/types/chartContext";
import { LineElement } from "../../model/lineElement";
import { Chart } from "../../model/chart";
import { Block } from "../../model/block";
import { LineElementKeyService } from "./lineElementKeyService";
import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { GlobalKeyService } from "./globalKeyService";

export interface LyricSegmentKeyServiceResult{
    updated: boolean,
    chartEditingState?: ChartEditingState
}

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
    ): LyricSegmentKeyServiceResult{
    
        let updateResult;
        
        const globalKeyService = new GlobalKeyService(this.chartEditingState, this.undoWrapper);
        const result = globalKeyService.handleGlobalKeyDown(event);
        if(result.updated){
            return result;
        }

        if (event.key === ' ') {
            updateResult = this.handleSpace(
                event,
                this.chartEditingState.chart,
                lineElement,
                cursorPosition
            );
        } else if (event.key === 'Enter') {
            updateResult = this.handleEnter(
                event,
                this.chartEditingState.chart,
                lineElement,
                cursorPosition
            );
        } else if (event.key === 'Backspace' && cursorPosition === 0) {
            updateResult = this.handleBackspace(
                event,
                this.chartEditingState.chart,
                lineElement
            );
        } else if (event.key === 'Delete' && cursorPosition === contentLength) {
            updateResult = this.handleDelete(
                event,
                this.chartEditingState,
                lineElement,
                contentLength
            );
        } else if (event.ctrlKey && event.code === 'KeyK') {
            updateResult = {
                chart: {...this.chartEditingState.chart},
                currentFocus: this.handleEditFocus(event, lineElement)
            }
        } else {
            const lineElementKeyService = new LineElementKeyService('LYRIC', this.chartEditingState, this.undoWrapper);
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
    
    private handleSpace(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement, cursorPosition:number){
        event.preventDefault();
        const chartService = ChartService.with(chart);
        const newChordWrapper = chartService.splitLineElement(lineElement, '', cursorPosition);
    
        return {
            chart: chartService.finalize(),
            currentFocus: {id: newChordWrapper.lyricSegment.id, position: 0}
        }
    }
    
    private handleEnter(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement, cursorPosition:number){
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
    
    private handleBackspace(event:React.KeyboardEvent, chart:Chart, lineElement:LineElement){
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
    
    private handleDelete(event:React.KeyboardEvent, chartEditingState:ChartEditingState, lineElement:LineElement, contentLength:number){
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
    
    private handleEditFocus(event:React.KeyboardEvent, lineElement:LineElement){
        event.preventDefault();
        const chordSymbol = lineElement.chordSymbol;
        return {
            id: chordSymbol.id,
            position:chordSymbol.backingString.length
        };
    }
}
