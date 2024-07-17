import { ChartEditingState } from "../../view/types/chartContext";

export interface UndoWrapper{
    dirtyState?: ChartEditingState;
    undoStack: ChartEditingState[];
    redoStack: ChartEditingState[];
}