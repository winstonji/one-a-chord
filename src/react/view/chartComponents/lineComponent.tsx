import React, { useEffect, useState } from 'react'
import { Line } from '../../model/line';
import { ChordWrapper } from '../../model/chordWrapper';
import ChordWrapperComponent from './chordWrapperComponent';
import "./styles/lineElementStyles.scss"

function LineComponent(line:Line) {
	
	const chordWrappers:ChordWrapper[] = line.chordWrappers;

	return (<div className = "oac-row oac-row-flex-start oac-line oac-row-align-stretch">
		{chordWrappers.map((chordWrapper:ChordWrapper) => {
			return <ChordWrapperComponent {...chordWrapper}/>
		})}
	</div>);
}

export default LineComponent;