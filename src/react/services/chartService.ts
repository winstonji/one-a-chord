import { Chart } from "../model/chart";
import { ChordWrapper } from "../model/chordWrapper";
import cloneDeep from 'lodash/cloneDeep'
import { Identifiable } from "../model/interfaces/identifiable";
import { v4 as uuidv4 } from 'uuid';
import { KeyValue } from "../model/key";
import { Line } from "../model/line";

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
            } else {
                console.error('The previous element is not found within any Line.');
            }
    
            return updatedChart;
        });

        return newChordWrapperId;
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
    private traceIds(targets: Identifiable): string[]{
        return this.traceIdsHelper([], targets).reverse();
    }

    //Helper method for above method. The recursive base case is when the current identifiable has no parent (meaning it is a block)
    private traceIdsHelper(idTrace: string[], identifiable: Identifiable): string[]{
        idTrace.push(identifiable.id);

        if(identifiable.parent){
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
        return (this.locateElementHelper<T>(idTrace, 0, chart.blocks) as T);
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