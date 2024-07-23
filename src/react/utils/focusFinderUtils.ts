import { Chart } from "../model/chart";
import { Identifiable } from "../model/interfaces/identifiable";
import { Line } from "../model/line";
import { LineElement } from "../model/lineElement";

type NavigationMode = 'PREVIOUS' | 'NEXT' | 'PREVIOUS_BOUNDED' | 'NEXT_BOUNDED'

export class FocusFinder {
        
    public static focusBoundExtremity(currentFocus:LineElement, containerBounds:Identifiable, direction: NavigationMode): LineElement{
        let nextExtremity: LineElement;
        switch (direction) {
            case 'PREVIOUS':
                nextExtremity = FocusFinder.focusFirstOf(containerBounds);
                if (nextExtremity.id === currentFocus.id) {
                    nextExtremity = currentFocus.getPrevious();
                }
                break;
            case 'PREVIOUS_BOUNDED':
                nextExtremity = FocusFinder.focusFirstOf(containerBounds);
                break;
            case 'NEXT_BOUNDED':
                nextExtremity = FocusFinder.focusLastOf(containerBounds);
                break;
            case 'NEXT':
                nextExtremity = FocusFinder.focusLastOf(containerBounds);
                if (nextExtremity.id === currentFocus.id) {
                    nextExtremity = currentFocus.getNext();
                }
            }
        return nextExtremity;
    }

    static focusFirstOf(ancestor:Identifiable): LineElement {
        if (ancestor.children === undefined) {

            if(!(ancestor instanceof LineElement)){
                console.error(`Error: element with id ${ancestor.id} has no children and is not a LineElement`);
            }

            return (ancestor as LineElement);
        } else {
            return this.focusFirstOf(ancestor.children[0]);
        }
    }

    static focusLastOf(ancestor:Identifiable): LineElement {
        if (ancestor.children === undefined) {

            if(!(ancestor instanceof LineElement)){
                console.error(`Error: element with id ${ancestor.id} has no children and is not a LineElement`);
            }

            return (ancestor as LineElement);
        } else {
            return this.focusLastOf(ancestor.children[ancestor.children.length - 1]);
        }
    }

    public static focusChartStart(chart:Chart): LineElement | undefined{
        if(!chart.children){
            console.error("Chart has no block children.");
            return;
        }

        const firstBlock = chart.children[0];

        if(!firstBlock.children){
            console.error("First block has no children.");
            return;
        }

        const firstLine = firstBlock.children[0];

        if(!firstLine.children){
            console.error("First line has no children.");
            return;
        }

        return firstLine.children[0];
    }

    public static focusChartEnd(chart:Chart): LineElement | undefined{
        if(!chart.children){
            console.error("Chart has no block children.");
            return;
        }

        const lastBlock = chart.children[chart.children.length - 1];

        if(!lastBlock.children){
            console.error("First block has no children.");
            return;
        }

        const lastLine = lastBlock.children[lastBlock.children.length - 1];

        if(!lastLine.children){
            console.error("First line has no children.");
            return;
        }

        return lastLine.children[lastLine.children.length - 1];
    }
    
    public static focusUpFrom(currentFocus: LineElement): LineElement{
        return FocusFinder.focusNeighborLine(currentFocus, -1);
    }

    public static focusDownFrom(currentFocus: LineElement): LineElement{
        return FocusFinder.focusNeighborLine(currentFocus, 1);
    }

    private static focusNeighborLine(currentFocus: LineElement, direction: -1 | 1): LineElement {
        const currentLine: Line = currentFocus.parent;
        const currentIndex: number = currentLine.children.findIndex(cw => cw.id === currentFocus.id);
        const nextLine = currentLine.getNeighbor(direction);
        if (!nextLine) {
            if (direction === -1) {
                return currentLine.children[0];
            } else {
                return currentLine.children[currentLine.children.length - 1];
            }
        }
        if (currentIndex >= nextLine.children.length || currentLine.children.length === currentIndex + 1) {
            return nextLine.children[nextLine.children.length - 1];
        }
        return nextLine.children[currentIndex];
    }
}