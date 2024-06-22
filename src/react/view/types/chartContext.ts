import { Chart } from "../../model/chart";
import { CurrentFocus, UpdateCurrentFocusProps } from "./currentFocus";

export interface IChartContext {
    chartEditingState: ChartEditingState;
    setCurrentFocus: (val: UpdateCurrentFocusProps) => void;
    setChartEditingState: React.Dispatch<React.SetStateAction<ChartEditingState>>;
}

export interface ChartEditingState{
    chart: Chart;
    currentFocus: CurrentFocus;
}