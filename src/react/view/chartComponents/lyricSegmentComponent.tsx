import React, { useEffect, useState } from 'react'
import { ChordWrapper } from '../../model/chordWrapper';
const LyricSegmentComponent = (chordWrapper:ChordWrapper) => {
	return (<>
		{chordWrapper.lyricSegment}
	</>);
}

export default LyricSegmentComponent;