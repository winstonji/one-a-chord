import React, { useEffect, useState } from 'react'
import { ChordWrapper } from '../../model/chordWrapper';

function LyricSegmentComponent(chordWrapper:ChordWrapper) {
	return (<p className='oac-lyric-segment'>
		{chordWrapper.lyricSegment}
	</p>);
}

export default LyricSegmentComponent;