import React from 'react'
import ChordSymbolComponent from './chordSymbolComponent';
import LyricSegmentComponent from './lyricSegmentComponent';
import { LineElement } from '../../model/lineElement';

function LineElementComponent(chordWrapper:LineElement) {
    
    return (<div className='oac-col oac-line-element oac-row-flex-end'>
        <ChordSymbolComponent {...chordWrapper}/>
        <LyricSegmentComponent {...chordWrapper}/>
    </div>);
}

export default LineElementComponent;
