import React, { useEffect, useState } from 'react'
import ChordSymbol from './chordSymbol';
import LyricSegment from './lyricSegment';
const ChordWrapper = () => {
	return (<>
        <ChordSymbol/>
        <LyricSegment/>
    </>);
}

export default ChordWrapper;
