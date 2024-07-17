import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { ChartEditingState } from "../../view/types/chartContext";

export interface GlobalKeyServiceResult{
    updated: boolean,
    chartEditingState?: ChartEditingState
}

export class GlobalKeyService{
    private chartEditingState: ChartEditingState;
    private undoWrapper: UndoWrapper;

    public constructor(chartEditingState: ChartEditingState, undoWrapper: UndoWrapper){
        this.chartEditingState = chartEditingState;    
        this.undoWrapper = undoWrapper;
    }

    public handleGlobalKeyDown(event:React.KeyboardEvent):GlobalKeyServiceResult{
        let updateResult;

        if (event.ctrlKey) {
            if (event.key === 'z'){
                updateResult = this.handleUndo(event);
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

    private handleUndo(event:React.KeyboardEvent){
        event.preventDefault();
        this.undoWrapper.redoStack.push(this.chartEditingState);
        const previousState = this.undoWrapper.undoStack.pop();
        return previousState;
    }    
}