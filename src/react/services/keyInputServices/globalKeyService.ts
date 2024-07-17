import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { ChartEditingState } from "../../view/types/chartContext";
import { KeyServiceResult } from "../interfaces/keyServiceResult";

export class GlobalKeyService{
    private chartEditingState: ChartEditingState;
    private undoWrapper: UndoWrapper;

    public constructor(chartEditingState: ChartEditingState, undoWrapper: UndoWrapper){
        this.chartEditingState = chartEditingState;    
        this.undoWrapper = undoWrapper;
    }

    public handleGlobalKeyDown(event:React.KeyboardEvent): KeyServiceResult | undefined{
        let updateResult;

        if (event.ctrlKey) {
            if (event.key === 'z'){
                updateResult = this.handleUndo(event);
            }
        }

        if(updateResult){
            return {
                ...updateResult
            }
        }
    
        return undefined;
    }

    private handleUndo(event:React.KeyboardEvent){
        debugger;
        event.preventDefault();
        this.undoWrapper.redoStack.push(this.chartEditingState);
        const previousState = this.undoWrapper.undoStack.pop();
        return previousState;
    }    
}