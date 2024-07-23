import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChartContext, useChartContext } from '../programWindow';
import { Block } from '../../model/block';
import LineComponent from './lineComponent';
import { Line } from '../../model/line';
import "./styles/blockStyles.scss"
import { ChartService } from '../../services/chartService';
import { SelectionUtil } from '../../utils/selectionUtil';

function BlockComponent (block:Block){

	const lines:Line[] = block.children;

	const {chartEditingState, setChartEditingState, setCurrentFocus }= useChartContext();
	const editableHeader = useRef<HTMLHeadingElement>(null); // Ref for the contentEditable div

	const currentFocus = chartEditingState.currentFocus;

	useEffect(() => {
        if (editableHeader.current) {
            editableHeader.current.textContent = block.header;

            if(currentFocus.id === block.id){
                editableHeader.current.focus();
                
                const textNode = editableHeader.current.childNodes[0];
                if (textNode) {
                    SelectionUtil.setCursorPos(textNode, currentFocus.position);
                }
            }
        }
    });

	const updateHeader = (updatedHeader:string) => {
		setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateBlockHeader(block, updatedHeader);
        
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    ...chartEditingState.currentFocus,
                    position: SelectionUtil.getCursorPos()
                }
            };
        })
	}

    const handleFocusViaClick = () => {
        setCurrentFocus({id: block.id, position: SelectionUtil.getCursorPos()});
    }

	return (<div className='oac-block'>
		<h3
            ref={editableHeader}
			className='oac-block-header'
			contentEditable={true}
            onClick={handleFocusViaClick}
			onInput={(event) => updateHeader(event.currentTarget.textContent || '')}
		>
			{block.header}
		</h3>
		{(!lines || lines.length === 0) && <strong>This block has no lines</strong>}
		{lines && lines.map((line:Line) => {
			return <LineComponent key = {line.id} {...line}/>;
		})}
	</div>);
}

export default BlockComponent;