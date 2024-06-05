import React, { useEffect, useState } from 'react'
import { ChordWrapper } from '../../model/chordWrapper';

function LyricSegmentComponent(chordWrapper:ChordWrapper) {

	function handleClick(event){
		console.log(event.target);
		var inputField = document.createElement("input");
		inputField.value = event.target.value;
		event.target.parent.replaceChild(inputField, event.target);

	}

	return (<p className='oac-lyric-segment' onClick={handleClick}>
		{chordWrapper.lyricSegment}
	</p>);
}

export default LyricSegmentComponent;