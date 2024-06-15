import React, { useContext, useRef, useEffect } from 'react';
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    
    const { chartService, currentFocus, setCurrentFocus }= useContext(ChartContext);
    const editableRef = useRef<HTMLDivElement>(null); // Ref for the contentEditable div

    useEffect(() => {
        // Set the initial lyric content
        if (editableRef.current) {
            editableRef.current.textContent = chordWrapper.lyricSegment;

            if(currentFocus.id === chordWrapper.id){
                editableRef.current.focus();
            }
        }
    })

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
            
            setCurrentFocus({id: newChordWrapperId, position: 0});
            
            // Prevent the space from being added
            event.preventDefault();
        } else if (event.key === 'Backspace') {
            const selection = window.getSelection();
            setCurrentFocus({id: chordWrapper.id, position: cursorPosition - 1});
            // Check if the cursor is at the start
            if (selection.anchorOffset === 0) {
                chartService.mergeChordWrapper(chordWrapper, -1);
                event.preventDefault(); // Prevent the default backspace behavior
            }
        } else if (event.key === 'Delete') {
            const selection = window.getSelection();
            setCurrentFocus({id: chordWrapper.id, position: cursorPosition});
            // Check if the cursor is at the end
            if (selection.anchorOffset === contentLength) {
                chartService.mergeChordWrapper(chordWrapper, 1);
                event.preventDefault(); // Prevent the default delete behavior
            }
        } else if ((event.key === 'ArrowRight' && event.ctrlKey)
                || (event.key === 'ArrowRight' && cursorPosition === contentLength)) {
            // console.log("event reached");
            const nextChordWrapper = chordWrapper.getNeighbor(1);
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.id, position: 0});
                event.preventDefault();
                // console.log(`event executed: ${focusRef.current.id}`);
            }
        } else if ((event.key === 'ArrowLeft' && event.ctrlKey)
                || (event.key === 'ArrowLeft' && cursorPosition === 0)) {
            // console.log("event reached");
            const nextChordWrapper = chordWrapper.getNeighbor(-1);
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.id, position: nextChordWrapper.lyricSegment.length});
                event.preventDefault();
                // console.log(`event executed: ${focusRef.current.id}`);
            } 
        }
    };
    
    const handleFocus = (event) => {
        setCurrentFocus({id: chordWrapper.id, position: 0});
        // console.log(`current chord wrapper: ${chordWrapper.id}, useRef focus: ${JSON.stringify(currentFocus)}`);
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
