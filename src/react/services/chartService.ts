import { Chart } from "../model/chart";
import { ChordWrapper } from "../model/chordWrapper";
import cloneDeep from 'lodash/cloneDeep'
import { Identifiable } from "../model/interfaces/identifiable";
import { KeyValue } from "../model/key";

export class ChartService {

    private setChart: React.Dispatch<React.SetStateAction<Chart>>;

    constructor(setChart: React.Dispatch<React.SetStateAction<Chart>>){
        this.setChart = setChart;
    }

    /**
     * Updates the lyric segment within a specified chordWrapper.
     * @param lyric the new lyric value.
     * @param chordWrapper the location of the lyric segment to be updated.
     */
    public updateLyric(lyric: string, chordWrapper: ChordWrapper){
        this.setChart((previousChart: Chart) => {

            //We have to copy the original chord chart because otherwise we cannot modify it as it is a react immutable object
            //After copying it, we can just lookup and modify the object we want
            const updatedChart = cloneDeep(previousChart);
            const chordWrapperToUpdate = this.locateElement(chordWrapper, updatedChart);

            (chordWrapperToUpdate as ChordWrapper).lyricSegment = lyric;

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
    public updateChord(chordSymbolString:string, chordWrapper:ChordWrapper){
        this.setChart((previousChart:Chart) => {
            //We have to copy the original chord chart because otherwise we cannot modify it as it is a react immutable object
            //After copying it, we can just lookup and modify the object we want
            const updatedChart = cloneDeep(previousChart);
            const chordWrapperToUpdate: ChordWrapper = (this.locateElement(chordWrapper, updatedChart) as ChordWrapper);
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
    //TODO: make this generic
    private locateElement(target: Identifiable, chart: Chart): Identifiable | undefined
    {
        const idTrace: string[] = this.traceIds(target);
        return this.locateElementHelper(idTrace, 0, chart.blocks);
    }

    private locateElementHelper(idTrace: string[], currentId: number, currentLevelItems: Identifiable[]): Identifiable | undefined
    {
        
        const currentIdentifiable = currentLevelItems.find((identifiable: Identifiable) => identifiable.id === idTrace[currentId]);
        if(!currentIdentifiable){
            console.error(`Unable to locate identifiable, no ID matches. ${idTrace[currentId]} from ${idTrace}`);
            return undefined;
        }
        
        if(currentId === idTrace.length - 1){
            return currentIdentifiable;
        }

        currentLevelItems = currentIdentifiable.children;
        if(!currentLevelItems){
            console.error("Unable to locate identifiable in scanned levels, no more levels to scan.")
            return undefined;
        }

        return this.locateElementHelper(idTrace, currentId + 1, currentLevelItems)
    }
}