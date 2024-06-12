import React, { useEffect, useState } from 'react'
import { Block } from '../../model/block';
import LineComponent from './lineComponent';
import { Line } from '../../model/line';
import "./styles/blockStyles.scss"

function BlockComponent (block:Block){

	const lines:Line[] = block.children;

	return (<div className='oac-block'>
		<h3 className='oac-block-header'>{block.header}</h3>
		{(!lines || lines.length === 0) && <strong>This block has no lines</strong>}
		{lines && lines.map((line:Line) => {
			return <LineComponent {...line}/>;
		})}
	</div>);
}

export default BlockComponent;