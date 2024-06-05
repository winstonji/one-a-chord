import React, { useEffect, useState } from 'react'
import ChordSymbolComponent from './chordSymbolComponent';
import LyricSegmentComponent from './lyricSegmentComponent';
import { ChordWrapper } from '../../model/chordWrapper';
import { KeyValue } from '../../model/key';

function ChordWrapperComponent(chordWrapper:ChordWrapper) {
	
    
    
    return (<>
        <ChordSymbolComponent {...chordWrapper}/>
        <LyricSegmentComponent {...chordWrapper}/>
    </>);
}

export default ChordWrapperComponent;
