import React, { useEffect, useState } from 'react'
import ChordSymbolComponent from './chordSymbolComponent';
import LyricSegmentComponent from './lyricSegmentComponent';
import { ChordWrapper } from '../../model/chordWrapper';

function ChordWrapperComponent(chordWrapper:ChordWrapper) {
	
    
    
    return (<div className='oac-col oac-chord-wrapper oac-row-flex-end'>
        <ChordSymbolComponent {...chordWrapper}/>
        <LyricSegmentComponent {...chordWrapper}/>
    </div>);
}

export default ChordWrapperComponent;
