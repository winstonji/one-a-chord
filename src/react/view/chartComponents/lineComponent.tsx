import React, { useEffect, useState } from 'react'
import { Line } from '../../model/line';
import { ChordWrapper } from '../../model/chordWrapper';
import ChordWrapperComponent from './chordWrapperComponent';
function LineComponent(line:Line) {
	
	const chordWrappers:ChordWrapper[] = line.chordWrappers;

	return (<>
		<ChordWrapperComponent {...chordWrappers[0]}/>
	</>);
}

export default LineComponent;