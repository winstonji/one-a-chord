import React, { useEffect, useState } from 'react'
import { Line } from '../../model/line';
import { LineElement } from '../../model/lineElement';
import LineElementComponent from './chordWrapperComponent';
import "./styles/lineElementStyles.scss"

function LineComponent(line:Line) {
	
	const lineElements:LineElement[] = line.children;

	return (<div className = "oac-row oac-row-flex-start oac-line oac-row-align-stretch">
		{(!lineElements || lineElements.length === 0) && <strong>This lines has no chord data</strong>}
		{lineElements && lineElements.map((lineElement:LineElement) => {
			return <LineElementComponent key = {lineElement.id} {...lineElement}/>
		})}
	</div>);
}

export default LineComponent;