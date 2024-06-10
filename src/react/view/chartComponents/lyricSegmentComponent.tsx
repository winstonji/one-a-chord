import React, { useContext, useState } from 'react'
import { ChordWrapper } from '../../model/chordWrapper'
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    
    const {chartService}: {chartService: ChartService} = useContext(ChartContext);

    const updateLyric = (updatedLyric: string) => {
        chartService.updateLyric(updatedLyric, chordWrapper)
    };

    return (
        <div
            className="oac-lyric-segment"
            contentEditable
            onBlur={(event) => {updateLyric(event.target.innerText)}}
        >
            {chordWrapper.lyricSegment}
        </div>
    );
}

export default LyricSegmentComponent;