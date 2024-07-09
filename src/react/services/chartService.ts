import { Chart } from "../model/chart";
import { LineElement } from "../model/lineElement";
import cloneDeep from 'lodash/cloneDeep'
import { Identifiable } from "../model/interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';
import { Line } from "../model/line";
import { Block } from "../model/block";
import { Key } from "../model/key";

export interface TimeSignatureUpdate{
    timeUpper?: number,
    timeLower?: number
}

export class ChartService {

    private chart: Chart;

    constructor(chart: Chart){
        this.chart = chart;
    }

    public static with(chart: Chart): ChartService{
        return new ChartService(cloneDeep(chart));
    }

    public finalize(){
        return this.chart;
    }

    public splitLineElement(firstLineElement: LineElement, chordSymbol: string, splittingPoint: number): LineElement {           
        // Retrieve the line that contains the previousElement.
        const firstLineElementRef:LineElement = this.locateElement<LineElement>(firstLineElement, this.chart);

        if (!firstLineElementRef) {
            console.error(`The requested chord wrapper with id ${firstLineElement.id} cannot be found.`);
            return null;
        }

        const line = firstLineElementRef.parent;

        // Find the index of the previousElement in the chordWrappers array
        const index = line.children.findIndex((element) => element.id === firstLineElementRef.id);

        const lyricsBeforeSplit = firstLineElementRef.lyricSegment.lyric.substring(0, splittingPoint);
        const lyricsAfterSplit = firstLineElementRef.lyricSegment.lyric.substring(splittingPoint);

        firstLineElementRef.lyricSegment.lyric = lyricsBeforeSplit;

        // Create a new ChordWrapper instance and insert after previousChordWrapperRef
        const secondChordWrapper = new LineElement(line, uuidv4(), chordSymbol, lyricsAfterSplit);
        line.children.splice(index + 1, 0, secondChordWrapper);

        return secondChordWrapper;
    }

    public insertNewLineAfter(currentlyFocusedLineElement: LineElement, cursorPosition: number): Line {
        
        const currentlyFocusedLineElementRef: LineElement = this.locateElement<LineElement>(currentlyFocusedLineElement, this.chart);

        if (!currentlyFocusedLineElementRef) {
            console.error(`The requested chord wrapper with id ${currentlyFocusedLineElement.id} cannot be found.`);
            return null;
        }
    
        let secondLine: Line;
        if(cursorPosition === 0){
            secondLine = this.moveLineElementToNewLine(currentlyFocusedLineElementRef);
        }
        else{
            secondLine = this.splitLineElementToNewLine(currentlyFocusedLineElementRef, cursorPosition);
        }
        
        return secondLine;
    }

    private moveLineElementToNewLine(lineElement: LineElement): Line{
        const {
            firstLine,
            block,
            chordWrapperIndex,
            lineIndex,
            secondLine
        } = this.getDataForNewLineCreation(lineElement);

        secondLine.children = [...firstLine.children.slice(chordWrapperIndex)];
        for (let child of secondLine.children) {
            child.parent = secondLine;
        }

        block.children.splice(lineIndex + 1, 0, secondLine);
        firstLine.children = firstLine.children.slice(0, chordWrapperIndex);
        return secondLine;
    }


    private splitLineElementToNewLine(lineElement: LineElement, splitPoint: number): Line{
        const {
            firstLine,
            block,
            chordWrapperIndex,
            lineIndex,
            secondLine
        } = this.getDataForNewLineCreation(lineElement);
       
        secondLine.children = [new LineElement(secondLine, uuidv4(), '', lineElement.lyricSegment.lyric.substring(splitPoint)), ...firstLine.children.slice(chordWrapperIndex + 1)];
        
        firstLine.children = firstLine.children.slice(0, chordWrapperIndex + 1);

        lineElement.lyricSegment.lyric = (lineElement.lyricSegment.lyric.substring(0, splitPoint));

        // Insert the new Line right after the previousElement
        
        block.children.splice(lineIndex + 1, 0, secondLine);
        return secondLine;
    }

    private getDataForNewLineCreation(chordWrapper: LineElement){
        const firstLine:Line = chordWrapper.parent;
        const block:Block = firstLine.parent;
        const chordWrapperIndex = firstLine.children.findIndex((_cw) => _cw.id === chordWrapper.id);
        const lineIndex = block.children.findIndex((_line) => _line.id === firstLine.id);

        const secondLine = new Line(block, uuidv4());

        return {
            firstLine,
            block,
            chordWrapperIndex,
            lineIndex,
            secondLine
        }
    }

    public mergeLineElement(targetElement: LineElement, direction: -1 | 1): LineElement{
        const line: Line = this.locateElement<Line>(targetElement.parent, this.chart);
        const updatedTarget: LineElement = this.locateElement<LineElement>(targetElement, this.chart);
        if (!line) {
            return null;
        }
            
        const index = line.children.findIndex((element) => element.id === updatedTarget.id);

        if (index >= 0 && index + direction >= 0 && index + direction < line.children.length) {
            let mergedChordSymbol:string;
            let mergedLyricSegment:string;
            if (direction < 0) {
                mergedChordSymbol = line.children[index + direction].chordSymbol.backingString + updatedTarget.chordSymbol.backingString;
                mergedLyricSegment = line.children[index + direction].lyricSegment.lyric + updatedTarget.lyricSegment.lyric;
            } else {
                mergedChordSymbol = updatedTarget.chordSymbol.backingString + line.children[index + direction].chordSymbol.backingString;
                mergedLyricSegment = updatedTarget.lyricSegment.lyric + line.children[index + direction].lyricSegment.lyric;
            }
            updatedTarget.chordSymbol.setChordSymbol(mergedChordSymbol);
            updatedTarget.lyricSegment.lyric = mergedLyricSegment;
            line.children.splice(index + direction, 1);
            return updatedTarget;
        } else {
            if (direction < 0) {
                return this.mergeLineIntoPrevious(targetElement);
            } else {
                return this.mergeNextIntoLine(targetElement);
            }
        }
    }

    public mergeLineIntoPrevious(currentlyFocusedLineElement:LineElement): LineElement{
        try {
            const secondLine:Line = this.locateElement<Line>(currentlyFocusedLineElement.parent, this.chart);
            let firstLine:Line = this.locateElement<Line>(secondLine.getPrevious(), this.chart);
            console.log(firstLine.id);
            const newFocusIndex = firstLine.children.length;
            firstLine.children = firstLine.children.concat(secondLine.children);
            for (let child of firstLine.children){
                child.parent = firstLine;
            }
    
            // delete secondLine.
            const block:Block = this.locateElement<Block>(secondLine.parent, this.chart);
            const lineIndex = block.children.findIndex((line) => line.id === secondLine.id);
            block.children.splice(lineIndex, 1);
            if (block.children.length <= 0) {
                this.deleteBlock(block);
            }
            return firstLine.children[newFocusIndex];
        } catch (error) {
            return undefined;
        }
    }

    public mergeNextIntoLine(currentlyFocusedLineElement:LineElement): LineElement{
        try {
            let firstLine:Line = this.locateElement<Line>(currentlyFocusedLineElement.parent, this.chart);
            const secondLine:Line = this.locateElement<Line>(firstLine.getNext(), this.chart);
            firstLine.children = firstLine.children.concat(secondLine.children);
            for (let child of firstLine.children){
                child.parent = firstLine;
            }
    
            // delete secondLine.
            const block:Block = this.locateElement<Block>(secondLine.parent, this.chart);
            const lineIndex = block.children.findIndex((line) => line.id === secondLine.id);
            block.children.splice(lineIndex, 1);
            if (block.children.length <= 0) {
                this.deleteBlock(block);
            }
            return currentlyFocusedLineElement;
        } catch (error) {
            return undefined;
        }
    }

    public deletePrevious(currentlyFocusedLineElement:LineElement){
        const line:Line = this.locateElement<Line>(currentlyFocusedLineElement.parent, this.chart);
        if (line) {
            const currentIndex = line.children.findIndex((element) => element.id === currentlyFocusedLineElement.id);
            if (currentIndex === 0) {
                return this.mergeLineIntoPrevious(currentlyFocusedLineElement);
            }
            const deleteTarget = this.locateElement<LineElement>(currentlyFocusedLineElement.getPrevious(), this.chart);
            const deleteIndex = line.children.findIndex((element) => element.id === deleteTarget.id);

            line.children.splice(deleteIndex, 1);
        }
    }

    public deleteNext(currentlyFocusedLineElement:LineElement){
        const line:Line = this.locateElement<Line>(currentlyFocusedLineElement.parent, this.chart);
        if (line) {            
            const currentIndex = line.children.findIndex((element) => element.id === currentlyFocusedLineElement.id);
            if (currentIndex === line.children.length - 1) {
                return this.mergeNextIntoLine(currentlyFocusedLineElement);
            }
            const deleteTarget = this.locateElement<LineElement>(currentlyFocusedLineElement.getNext(), this.chart);
            const deleteIndex = line.children.findIndex((element) => element.id === deleteTarget.id);

            line.children.splice(deleteIndex, 1);
        }
    }

    insertNewBlockAfter(currentlyFocusedLineElement: LineElement, cursorPosition: number): Block {
        const currentBlock: Block = this.locateElement<Block>(currentlyFocusedLineElement.parent.parent, this.chart);
        const blockIndex: number = currentBlock.chart.children.findIndex((element) => element.id === currentBlock.id);
        const newBlock: Block = new Block(currentBlock.chart, "Block", uuidv4());
        const newLine: Line = this.insertNewLineAfter(currentlyFocusedLineElement, cursorPosition);
        const newLineIndex: number = newLine.parent.children.findIndex((element) => element.id === newLine.id);
        currentBlock.chart.children.splice(blockIndex + 1, 0, newBlock);
        newBlock.children = currentBlock.children.splice(newLineIndex);

        for (let line of newBlock.children) {
            line.parent = newBlock;
            for (let grandchild of line.children) {
                grandchild.parent = line;
                grandchild.lyricSegment.parent = grandchild;
                grandchild.chordSymbol.parent = grandchild;
            }
        }
        return newBlock;
    }
    
    

    public deleteBlock(target:Block){
        const targetIndex:number = target.chart.children.findIndex((element) => element.id === target.id)
        target.chart.children.splice(targetIndex, 1);
    }

    /**
     * Updates the lyric segment within a specified chordWrapper.
     * @param lyric the new lyric value.
     * @param lineElement the location of the lyric segment to be updated.
     */
    public updateLyric(lineElement: LineElement, lyric: string){
        const lineElementRef: LineElement = this.locateElement<LineElement>(lineElement, this.chart);
        lineElementRef.lyricSegment.lyric = lyric;
    }

    /**
     * Updates the chord symbol properties within a specified chordWrapper.
     * @param root of the chord symbol as a KeyValue.
     * @param quality of the chord symbol as a string. 
     * @param extensions of the chord symbol as a string array.
     * @param slash root of the chord symbol as a KeyValue.
     * @param lineElement the location of the chord symbol to be updated.
     */
    public updateChord(lineElement:LineElement, chordSymbolString:string){
        
        // Locate and update the chord wrapper
        const lineElementRef: LineElement = this.locateElement<LineElement>(lineElement, this.chart);

        lineElementRef.chordSymbol.setChordSymbol(chordSymbolString);
    }
    
    public updateBlockHeader(block:Block, updatedHeader:string){
        const blockRef: Block = this.locateElement<Block>(block, this.chart);
        blockRef.header = updatedHeader;
    }

    public updateChartTitle(updatedTitle: string){
        this.chart.metaData.title = updatedTitle;
    }

    public updateChartKey(updatedKey: string){
        const key = Key.getKeyValueByPrintName(updatedKey);
        if(!key){

            //TODO figure out how we want to handle this
            console.error('invalid key entered');
        }
        this.chart.metaData.keyValue = key; 
    }

    public updateTime(updates: TimeSignatureUpdate){
        if(!updates.timeLower && !updates.timeUpper){

            //TODO figure out how we want to handle this
            console.error('invalid time signature update, no data provided');
        }
        
        if(updates.timeLower){
            this.chart.metaData.signatureBottom = updates.timeLower;
        }

        if(updates.timeUpper){
            this.chart.metaData.signatureTop = updates.timeUpper;
        }
    }

    public updateTempo(updatedTempo: number){
        this.chart.metaData.tempo = updatedTempo;
    }

    //Given an Identifiable, recursively gather IDs in an array. First, get the ID of the identifiable itself and push it to the array.
    //Then, recursively get the parent of the current identifiable and repeat the process.
    //If you call this function with a ChordWrapper, for example, it will give you an array like this [block id, line id, chord wrapper id]
    private traceIds(target: Identifiable): string[]{
        return this.traceIdsHelper([], target).reverse();
    }

    //Helper method for above method. The recursive base case is when the current identifiable has no parent (meaning it is a block)
    private traceIdsHelper(idTrace: string[], identifiable: Identifiable): string[]{
        idTrace.push(identifiable.id);

        if(identifiable.parent && !(identifiable.parent instanceof Chart)){
            return this.traceIdsHelper(idTrace, identifiable.parent);
        }

        return idTrace;
    }

    //Given a list of IDs, follow the IDs down the chain and return the element represented by the last ID
    //The list of IDs should start with a block ID and then go as far as necessary.
    //EX: [id1, id2, id3]. This will first look up the Block with id===id1, then it will get the children of block (lines) and look up the line with id===id2
    //Finally, we will get the children of line (chordWrappers) and look up the chordWrapper with id===id3.
    //We will then return chordWrapper as it is the element we were looking for.
    private locateElement<T extends Identifiable>(target: Identifiable, chart: Chart): T | undefined
    {
        const idTrace: string[] = this.traceIds(target);
        return (this.locateElementHelper<T>(idTrace, 0, chart.children) as T);
    }

    private locateElementHelper<T extends Identifiable>(idTrace: string[], currentId: number, currentLevelItems: Identifiable[]): T | undefined
    {
        
        const currentIdentifiable = currentLevelItems.find((identifiable: Identifiable) => identifiable.id === idTrace[currentId]);
        if(!currentIdentifiable){
            console.error(`Unable to locate identifiable, no ID matches. ${idTrace[currentId]} from ${idTrace}`);
            return undefined;
        }
        
        if(currentId === idTrace.length - 1){
            return (currentIdentifiable as T);
        }

        currentLevelItems = currentIdentifiable.children;
        if(!currentLevelItems){
            console.error("Unable to locate identifiable in scanned levels, no more levels to scan.")
            return undefined;
        }

        return this.locateElementHelper(idTrace, currentId + 1, currentLevelItems)
    }
}