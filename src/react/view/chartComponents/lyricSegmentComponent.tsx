import React, { useContext, useRef, useEffect } from 'react';
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    
    const { chartService, focusRef }= useContext(ChartContext);
    const editableRef = useRef<HTMLDivElement>(null); // Ref for the contentEditable div

    useEffect(() => {
        // Set the initial lyric content
        if (editableRef.current) {
            editableRef.current.textContent = chordWrapper.lyricSegment;

            if(focusRef.current.id === chordWrapper.id){
                editableRef.current.focus();
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(editableRef.current.childNodes[0], focusRef.current.position);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    });

    const updateLyric = (updatedLyric: string) => {
        chartService.updateLyric(chordWrapper, updatedLyric);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        const textAfterCursor = editableRef.current.textContent.slice(cursorPosition);
        const textBeforeCursor = editableRef.current.textContent.slice(0, cursorPosition);
        const contentLength = editableRef.current.textContent.length;
        
        
        if (event.key === ' ' && editableRef.current) {
            const newChordWrapperId = chartService.insertNewChordWrapper(chordWrapper, '', textAfterCursor);
            chartService.updateLyric(chordWrapper, textBeforeCursor);
            
            focusRef.current = {id: newChordWrapperId, position: 0}
            
            // Prevent the space from being added
            event.preventDefault();
        } else if (event.key === 'Backspace') {
            const selection = window.getSelection();
            focusRef.current = {id: chordWrapper.id, position: cursorPosition - 1};
            // Check if the cursor is at the start
            if (selection.anchorOffset === 0) {
                chartService.mergeChordWrapper(chordWrapper, -1);
                
                
                event.preventDefault(); // Prevent the default backspace behavior
            }
        } else if (event.key === 'Delete') {
            const selection = window.getSelection();
            focusRef.current = {id: chordWrapper.id, position: cursorPosition};
            // Check if the cursor is at the end
            if (selection.anchorOffset === contentLength) {
                chartService.mergeChordWrapper(chordWrapper, 1);
                event.preventDefault(); // Prevent the default delete behavior
                const newRange = document.createRange();
                newRange.setStart(editableRef.current, cursorPosition);
                newRange.collapse(true);
            }
        } 
    };
    
    const handleFocus = (event) => {
        console.log(`current chord wrapper: ${chordWrapper.id}, useRef focus: ${JSON.stringify(focusRef)}`);
        focusRef.current = {id: chordWrapper.id, position: 0};
    }
      
    return (
        <div
            ref={editableRef}
            className="oac-lyric-segment"
            contentEditable
            onFocus = {handleFocus}
            onKeyDown={handleKeyDown}
            onInput={(event) => updateLyric(event.currentTarget.textContent || '')}
        >
        </div>
    );
}

export default LyricSegmentComponent;
