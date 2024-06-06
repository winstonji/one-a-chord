import React, { useState, useRef } from 'react'
import { ChordWrapper } from '../../model/chordWrapper'

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    const [text, setText] = useState(chordWrapper.lyricSegment)

    return (<div
		className="oac-lyric-segment"
		contentEditable>
		{text}
	</div>)
}

export default LyricSegmentComponent
