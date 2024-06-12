import React, { useContext, useRef, useEffect } from 'react';
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';

function LyricSegmentComponent({ chordWrapper }: { chordWrapper: ChordWrapper }) {
    
    const { chartService }: { chartService: ChartService } = useContext(ChartContext);
    const editableRef = useRef<HTMLDivElement>(null); // Ref for the contentEditable div

    useEffect(() => {
        // Set the initial lyric content
        if (editableRef.current) {
            editableRef.current.textContent = chordWrapper.lyricSegment;
        }
    }, [chordWrapper.lyricSegment]);

    const updateLyric = (updatedLyric: string) => {
        chartService.updateLyric(updatedLyric, chordWrapper);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === ' ' && editableRef.current) {
            const cursorPosition = window.getSelection().anchorOffset;
            const textAfterCursor = editableRef.current.textContent.slice(cursorPosition);
            const textBeforeCursor = editableRef.current.textContent.slice(0, cursorPosition);

            // Create a new ChordWrapper with the text after the cursor
            const newChordWrapper = chartService.createNewChordWrapper(textAfterCursor);

            // Update the current ChordWrapper with the text before the cursor
            chartService.updateLyric(textBeforeCursor, chordWrapper);

            // Prevent the space from being added
            event.preventDefault();
        } else if (event.key === 'Backspace' && editableRef.current?.textContent === '') {
            // Logic to delete the current ChordWrapper component
            chartService.deleteChordWrapper(chordWrapper.id);
        }
    };

    return (
        <div
            ref={editableRef}
            className="oac-lyric-segment"
            contentEditable
            onInput={(event) => updateLyric(event.currentTarget.textContent || '')}
            onKeyDown={handleKeyDown}
        >
        </div>
    );
}

export default LyricSegmentComponent;
