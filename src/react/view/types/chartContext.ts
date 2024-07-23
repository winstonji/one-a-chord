import { Chart } from "../../model/chart";
import { UndoWrapper } from "../../model/interfaces/undoWrapper";
import { KeyServiceResult } from "../../services/interfaces/keyServiceResult";
import { CurrentFocus, UpdateCurrentFocusProps } from "./currentFocus";

export interface IChartContext {
    chartEditingState: ChartEditingState;
    setCurrentFocus: (val: UpdateCurrentFocusProps) => void;
    setChartEditingState: (chartEditingState: (chartEditingState: ChartEditingState) => KeyServiceResult) => void;
    undoRef: React.MutableRefObject<UndoWrapper>;
}

export interface ChartEditingState{
    chart: Chart;
    currentFocus: CurrentFocus;
}