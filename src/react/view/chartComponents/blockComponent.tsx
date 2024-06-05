import React, { useEffect, useState } from 'react'
import { Block } from '../../model/block';
import LineComponent from './lineComponent';
import { Line } from '../../model/line';
function BlockComponent (block:Block){

	const lines:Line[] = block.lines;

	return (<>
		<h3>{block.header}</h3>
		<LineComponent {...lines[0]}/>
	</>);
}

export default BlockComponent;