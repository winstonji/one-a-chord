import React, { useEffect, useState } from 'react'
import { Line } from '../../model/line';
import { ChordWrapper } from '../../model/chordWrapper';
import ChordWrapperComponent from './chordWrapperComponent';
import "./styles/lineElementStyles.scss"

function LineComponent(line:Line) {
	
	const chordWrappers:ChordWrapper[] = line.children;

	return (<div className = "oac-row oac-row-flex-start oac-line oac-row-align-stretch">
		{(!chordWrappers || chordWrappers.length === 0) && <strong>This lines has no chord data</strong>}
		{chordWrappers && chordWrappers.map((chordWrapper:ChordWrapper) => {
			return <ChordWrapperComponent key = {chordWrapper.id} {...chordWrapper}/>
		})}
	</div>);
}

export default LineComponent;