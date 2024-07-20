import { useContext, useEffect, useRef } from "react";
import { ChartContext, useChartContext } from "../../programWindow";
import { ConstantFocusIds } from "../../types/currentFocus";
import { SelectionUtil } from "../../../utils/selectionUtil";
import { ChartService } from "../../../services/chartService";
import React from "react";

function TimeLowerComponent(props: { signatureBottom: number }) {
    const { signatureBottom } = props;
    const { chartEditingState, setChartEditingState, setCurrentFocus } = useChartContext();

    const editableRef = useRef<HTMLHeadingElement>(null);

    const currentFocus = chartEditingState.currentFocus;

    useEffect(() => {
        if (editableRef.current) {
            if (currentFocus.id === ConstantFocusIds.TIME_LOWER) {
                const textNode = editableRef.current.childNodes[0];
                if (textNode) {
                    SelectionUtil.setCursorPos(textNode, currentFocus.position);
                }
            }
        }
    });

    function updateTimeLower(newVal: string) {
        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateTime({timeLower: parseInt(newVal) || 0});
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
        setCurrentFocus({ id: ConstantFocusIds.TIME_LOWER, position: SelectionUtil.getCursorPos() });
    }

    return <>
        <div className='oac-row'>
            <p
                ref={editableRef}
                className='oac-time-signature'
                contentEditable={true}
                onInput={(event) => updateTimeLower(event.currentTarget.textContent || '')}
                onClick={handleFocusViaClick}
            >
                {signatureBottom}
            </p>
        </div>
    </>
}

export default TimeLowerComponent;