import { Chart } from "../model/chart";
import { ChordWrapper } from "../model/chordWrapper";
import cloneDeep from 'lodash/cloneDeep'
import { Identifiable } from "../model/interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';
import { KeyValue } from "../model/key";
import { Line } from "../model/line";
import { Block } from "../model/block";

export class ChartService {

    private setChart: React.Dispatch<React.SetStateAction<Chart>>;

    constructor(setChart: React.Dispatch<React.SetStateAction<Chart>>){
        this.setChart = setChart;
    }

    public insertNewChordWrapper(previousElement: ChordWrapper, chordSymbol: string, lyricSegment: string): string {
        let newChordWrapperId = uuidv4();

        this.setChart((previousChart: Chart) => {
            // Copy the original chord chart to be able to modify it
            const updatedChart = cloneDeep(previousChart);
            
            // Retrieve the line that contains the previousElement.
            const line:Line = this.locateElement<Line>(previousElement.parent, updatedChart);
    
            if (line) {
                // Find the index of the previousElement in the chordWrappers array
                const index = line.children.findIndex((element) => element.id === previousElement.id);
    
                // Create a new ChordWrapper instance
                const newChordWrapper = new ChordWrapper(line, newChordWrapperId, chordSymbol, lyricSegment);
                // Insert the new ChordWrapper right after the previousElement
                line.children.splice(index + 1, 0, newChordWrapper);

                const previousChordWrapper = this.locateElement<ChordWrapper>(previousElement, updatedChart);
                previousChordWrapper.setLyricSegment(previousChordWrapper.lyricSegment.replace(lyricSegment, ''));
            } else {
                console.error('The previous element is not found within any Line.');
            }
    
            return updatedChart;
        });

        return newChordWrapperId;
    }

    public insertNewLine(currentLine: Line, currentlyFocusedChordWrapper: ChordWrapper, cursorPosition: number): string {
        let newLineId;

        this.setChart((previousChart: Chart) => {
            const updatedChart = cloneDeep(previousChart);
            
            // Retrieve the block that contains the previous line.
            const block:Block = this.locateElement<Block>((currentLine.parent), updatedChart);
            console.log(block);

            if (!block) {
                console.error('The previous element is not found within any Block.');
                return;
            }

            // Find the index of the currentLine in the children array
            const lineIndex = block.children.findIndex((_line) => _line.id === currentLine.id);
            const chordWrapperIndex = currentLine.children.findIndex((_chordWrapper) => _chordWrapper.id === currentlyFocusedChordWrapper.id);
            const newLine = new Line(block, uuidv4());
            
            if(cursorPosition === 0){
                // moveChordWrapperToNewLine
            }
            else{
                // splitChordWrapperAcrossLines
            }

            return updatedChart;
        });

        return newLineId;
    }

    private moveChordWrapperToNewLine(){

    }

    private splitChordWrapperAcrossLines(){
        const chordWrapperAfterSplitLyric = currentlyFocusedChordWrapper.lyricSegment.substring(cursorPosition);
        newLine.children = [new ChordWrapper(newLine, uuidv4(), '', chordWrapperAfterSplitLyric), ...currentLine.children.slice(chordWrapperIndex + 1)];
        

        const previousLine = this.locateElement<Line>(currentLine, updatedChart)
        previousLine.children = previousLine.children.slice(0, chordWrapperIndex + 1);

        const chordWrapperBeforeSplitLyric = currentlyFocusedChordWrapper.lyricSegment.substring(0, cursorPosition);
        const previousChordWrapper = this.locateElement<ChordWrapper>(currentlyFocusedChordWrapper, updatedChart);
        previousChordWrapper.setLyricSegment(chordWrapperBeforeSplitLyric);

        // Insert the new Line right after the previousElement
        block.children.splice(lineIndex + 1, 0, newLine);
    }

    public mergeChordWrapper(targetElement: ChordWrapper, direction: -1 | 1){
        let normalizedDirection:number = direction;
        this.setChart((previousChart: Chart) => {
            const updatedChart = cloneDeep(previousChart);
            const line: Line = this.locateElement<Line>(targetElement.parent, updatedChart);
            const updatedTarget: ChordWrapper = this.locateElement<ChordWrapper>(targetElement, updatedChart);
            if (line) {
                const index = line.children.findIndex((element) => element.id === updatedTarget.id);
    
                if (index !== -1 && index + normalizedDirection >= 0 && index + normalizedDirection < line.children.length) {
                    let mergedChordSymbol:string;
                    let mergedLyricSegment:string;
                    if (normalizedDirection < 0) {
                        mergedChordSymbol = line.children[index + normalizedDirection].backingString + updatedTarget.backingString;
                        mergedLyricSegment = line.children[index + normalizedDirection].lyricSegment + updatedTarget.lyricSegment;
                    } else {
                        mergedChordSymbol = updatedTarget.backingString + line.children[index + normalizedDirection].backingString;
                        mergedLyricSegment = updatedTarget.lyricSegment + line.children[index + normalizedDirection].lyricSegment;
                    }
                    updatedTarget.setChordSymbol(mergedChordSymbol);
                    updatedTarget.setLyricSegment(mergedLyricSegment);
                    // this.updateChord(targetElement, mergedChordSymbol);
                    // this.updateLyric(targetElement, mergedLyricSegment);
                    line.children.splice(index + direction, 1);
                } else {
                    console.error('Invalid merge operation: target or neighbor element not found.');
                }
            } else {
                console.error('The target element is not found within any Line.');
            }
    
            return updatedChart;
        });
    }

    /**
     * Updates the lyric segment within a specified chordWrapper.
     * @param lyric the new lyric value.
     * @param chordWrapper the location of the lyric segment to be updated.
     */
    public updateLyric(chordWrapper: ChordWrapper, lyric: string){
        this.setChart((previousChart: Chart) => {

            //We have to copy the original chord chart because otherwise we cannot modify it as it is a react immutable object
            //After copying it, we can just lookup and modify the object we want
            const updatedChart = cloneDeep(previousChart);
            const chordWrapperToUpdate: ChordWrapper = this.locateElement<ChordWrapper>(chordWrapper, updatedChart);
            chordWrapperToUpdate.setLyricSegment(lyric);

            return updatedChart;
        });
    }

    /**
     * Updates the chord symbol properties within a specified chordWrapper.
     * @param root of the chord symbol as a KeyValue.
     * @param quality of the chord symbol as a string. 
     * @param extensions of the chord symbol as a string array.
     * @param slash root of the chord symbol as a KeyValue.
     * @param chordWrapper the location of the chord symbol to be updated.
     */
    public updateChord(chordWrapper:ChordWrapper, chordSymbolString:string){
        this.setChart((previousChart:Chart) => {
            // Deep clone the chart
            const updatedChart = cloneDeep(previousChart);
            // Locate and update the chord wrapper
            const chordWrapperToUpdate: ChordWrapper = this.locateElement<ChordWrapper>(chordWrapper, updatedChart);

            chordWrapperToUpdate.setChordSymbol(chordSymbolString);
            return updatedChart;
        })
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