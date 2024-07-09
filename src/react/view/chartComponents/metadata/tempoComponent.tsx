import { useContext, useEffect, useRef } from "react";
import { ChartContext } from "../../programWindow";
import { ConstantFocusIds } from "../../types/currentFocus";
import { SelectionUtil } from "../../../utils/selectionUtil";
import { ChartService } from "../../../services/chartService";
import React from "react";

function TempoComponent(props: { tempo: number }) {
    const { tempo } = props;
    const { chartEditingState, setChartEditingState, setCurrentFocus } = useContext(ChartContext);

    const editableRef = useRef<HTMLHeadingElement>(null);

    const currentFocus = chartEditingState.currentFocus;

    useEffect(() => {
        if (editableRef.current) {
            if (currentFocus.id === ConstantFocusIds.TEMPO) {
                const textNode = editableRef.current.childNodes[0];
                if (textNode) {
                    SelectionUtil.setCursorPos(textNode, currentFocus.position);
                }
            }
        }
    });

    function updateTempo(newVal: string) {
        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateTempo(parseInt(newVal) || 0);
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    ...chartEditingState.currentFocus,
                    position: SelectionUtil.getCursorPos()
                }
            }
        })
    }

    const handleFocusViaClick = () => {
        setCurrentFocus({ id: ConstantFocusIds.TEMPO, position: SelectionUtil.getCursorPos() });
    }

    return <>
        <div className='oac-row'>
            <span>Tempo - </span>
            <p
                ref={editableRef}
                className='oac-metadata'
                contentEditable={true}
                onInput={(event) => updateTempo(event.currentTarget.textContent || '')}
                onClick={handleFocusViaClick}
            >
                {tempo}
            </p>
        </div>
    </>
}

export default TempoComponent;