import React, { useEffect, useState } from 'react'
import ChordSymbolComponent from './chordSymbolComponent';
import LyricSegmentComponent from './lyricSegmentComponent';
const ChordWrapperComponent = () => {
	return (<>
        <ChordSymbolComponent/>
        <LyricSegmentComponent/>
    </>);
}

export default ChordWrapperComponent;
