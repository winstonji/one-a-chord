import { Chart } from "../../model/chart";
import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { CurrentFocus, UpdateCurrentFocusProps } from "./currentFocus";

export interface IChartContext {
    chartEditingState: ChartEditingState;
    setCurrentFocus: (val: UpdateCurrentFocusProps) => void;
    setChartEditingState: React.Dispatch<React.SetStateAction<ChartEditingState>>;
    undoRef: React.MutableRefObject<UndoWrapper>;
}

export interface ChartEditingState{
    chart: Chart;
    currentFocus: CurrentFocus;
}