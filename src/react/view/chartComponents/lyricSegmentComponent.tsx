import React, { useState } from 'react'
import { ChordWrapper } from '../../model/chordWrapper'

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    const [lyric, setLyric] = useState(chordWrapper.lyricSegment);

    const updateLyric = (e: React.FormEvent<HTMLDivElement>) => {
        const newLyric = e.currentTarget.textContent || '';
        setLyric(newLyric);
        chordWrapper.lyricSegment = newLyric;
        console.log(chordWrapper.lyricSegment);
    };

    return (
        <div
            className="oac-lyric-segment"
            contentEditable
            onBlur={updateLyric}
        >
            {lyric}
        </div>
    );
}

export default LyricSegmentComponent;