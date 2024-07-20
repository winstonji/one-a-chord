import React, { useContext, useEffect, useRef } from "react";
import { ChartContext, useChartContext } from "../../programWindow";
import { ChartService } from "../../../services/chartService";
import { SelectionUtil } from "../../../utils/selectionUtil";
import { ConstantFocusIds } from "../../types/currentFocus";

function TitleComponenent(props: {title: string}){
    const {title} = props;
    const {chartEditingState, setChartEditingState, setCurrentFocus}= useChartContext();

    const editableRef = useRef<HTMLHeadingElement>(null);

    const currentFocus = chartEditingState.currentFocus;

	useEffect(() => {
        if (editableRef.current) {
            if(currentFocus.id === ConstantFocusIds.TITLE){
                const textNode = editableRef.current.childNodes[0];
                if (textNode) {
                    SelectionUtil.setCursorPos(textNode, currentFocus.position);
                }
            }
        }
    });

    function updateTitle(newVal: string){
        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateChartTitle(newVal);
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
        setCurrentFocus({id: ConstantFocusIds.TITLE, position: SelectionUtil.getCursorPos()});
    }

    return <>
        <h1
            ref={editableRef}
            className = 'oac-title'
            contentEditable = {true}
            onInput = {(event) => updateTitle(event.currentTarget.textContent || '')}
            onClick = {handleFocusViaClick}
        >
            {title}
        </h1>
    </>
}

export default TitleComponenent;