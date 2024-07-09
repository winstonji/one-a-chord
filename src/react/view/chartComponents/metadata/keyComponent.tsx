import { useContext, useEffect, useRef } from "react";
import { ChartContext } from "../../programWindow";
import { ConstantFocusIds } from "../../types/currentFocus";
import { SelectionUtil } from "../../../utils/selectionUtil";
import { ChartService } from "../../../services/chartService";
import React from "react";

function KeyComponent(props: { keySig: string }) {
    const { keySig } = props;
    const { chartEditingState, setChartEditingState, setCurrentFocus } = useContext(ChartContext);

    const editableRef = useRef<HTMLHeadingElement>(null);

    const currentFocus = chartEditingState.currentFocus;

    useEffect(() => {
        if (editableRef.current) {
            if (currentFocus.id === ConstantFocusIds.KEY) {
                const textNode = editableRef.current.childNodes[0];
                if (textNode) {
                    SelectionUtil.setCursorPos(textNode, currentFocus.position);
                }
            }
        }
    });

    function updateKey(newVal: string) {
        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateChartKey(newVal);
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
        setCurrentFocus({ id: ConstantFocusIds.KEY, position: SelectionUtil.getCursorPos() });
    }

    return <>
        <div className='oac-row'>
            <span>Key - </span>
            <p
                ref={editableRef}
                className='oac-metadata'
                contentEditable={true}
                onInput={(event) => updateKey(event.currentTarget.textContent || '')}
                onClick={handleFocusViaClick}
            >
                {keySig}
            </p>
        </div>
    </>
}

export default KeyComponent;