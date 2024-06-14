import React, { useContext, useRef, useEffect } from 'react';
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    
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
    
            chartService.insertNewChordWrapper(chordWrapper, '', textAfterCursor);
    
            // Update the current ChordWrapper with the text before the cursor
            chartService.updateLyric(textBeforeCursor, chordWrapper);
    
            // Prevent the space from being added
            event.preventDefault();
        } else if (event.key === 'Backspace') {
            const selection = window.getSelection();
            // Check if the cursor is at the start
            if (selection.anchorOffset === 0) {
                // Logic to merge the current ChordWrapper component with the previous component
                chartService.mergeChordWrapper(chordWrapper);
                event.preventDefault(); // Prevent the default backspace behavior
            }
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
