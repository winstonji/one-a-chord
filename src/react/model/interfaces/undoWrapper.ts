import { ChartEditingState } from "../../view/types/chartContext";

export interface UndoWrapper{
    undoStack: ChartEditingState[];
    redoStack: ChartEditingState[];
}