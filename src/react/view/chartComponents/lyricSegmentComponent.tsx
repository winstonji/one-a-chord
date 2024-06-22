import React, { useContext, useRef, useEffect } from 'react';
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { getCursorPos } from '../../utils/selectionUtil';

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
    
    const { chartService, currentFocus, setCurrentFocus }= useContext(ChartContext);
    const editableRef = useRef<HTMLDivElement>(null); // Ref for the contentEditable div

    useEffect(() => {
        // Set the initial lyric content
        if (editableRef.current) {
            editableRef.current.textContent = chordWrapper.lyricSegment;

            if(currentFocus.id === chordWrapper.id){
                editableRef.current.focus();
                
                const textNode = editableRef.current.childNodes[0];
                const selection: Selection = window.getSelection();
                const updatedPosition: Range = document.createRange();
                updatedPosition.setStart(textNode, currentFocus.position);
                updatedPosition.setEnd(textNode, currentFocus.position);
                selection.removeAllRanges();
                selection.addRange(updatedPosition);
            }
        }
    });

    const updateLyric = (updatedLyric: string) => {
        chartService.updateLyric(chordWrapper, updatedLyric);
        setCurrentFocus({position: getCursorPos()})
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const cursorPosition = getCursorPos();
        const textAfterCursor = editableRef.current.textContent.slice(cursorPosition);
        const contentLength = editableRef.current.textContent.length;
        
        if (event.key === ' ' && editableRef.current) {
            const newChordWrapperId = chartService.insertNewChordWrapper(chordWrapper, '', textAfterCursor);
            setCurrentFocus({id: newChordWrapperId, position: 0});
            
            // Prevent the space from being added
            event.preventDefault();
        } else if (event.key === 'Enter' && editableRef.current) {
            chartService.insertNewLine(chordWrapper.parent, chordWrapper, cursorPosition);            
            setCurrentFocus({id: '1', position: 0});
            
            // Prevent the space from being added
            event.preventDefault();
        } else if (event.key === 'Backspace') {
            const selection = window.getSelection();
            setCurrentFocus({position: cursorPosition - 1});
            // Check if the cursor is at the start
            if (selection.anchorOffset === 0) {
                const cursorPositionAfterMerge = chordWrapper.getPrevious().lyricSegment.length;
                chartService.mergeChordWrapper(chordWrapper, -1);
                setCurrentFocus({position: cursorPositionAfterMerge})
                event.preventDefault(); // Prevent the default backspace behavior
            }
        } else if (event.key === 'Delete') {
            const selection = window.getSelection();
            setCurrentFocus({position: cursorPosition});
            // Check if the cursor is at the end
            if (selection.anchorOffset === contentLength) {
                chartService.mergeChordWrapper(chordWrapper, 1);
                event.preventDefault(); // Prevent the default delete behavior
            }
        } else if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
            // console.log("event reached");
            const nextChordWrapper = chordWrapper.getNext();
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.id, position: 0});
                event.preventDefault();
                // console.log(`event executed: ${focusRef.current.id}`);
            }
        } else if (event.key === 'ArrowLeft' && (event.ctrlKey || cursorPosition === 0)) {
            // console.log("event reached");
            const nextChordWrapper = chordWrapper.getPrevious();
            if (nextChordWrapper) {
                setCurrentFocus({id: nextChordWrapper.id, position: nextChordWrapper.lyricSegment.length});
                event.preventDefault();
                // console.log(`event executed: ${focusRef.current.id}`);
            } 
        }
    };
    

    //This keeps the current focus in sync with the cursor in the DOM when you click an element.
    //Otherwise when you start typing, the cursor will jump to an incorrect position because the current focus state is wrong.
    const handleFocusViaClick = () => {
        setCurrentFocus({id: chordWrapper.id, position: getCursorPos()});
        console.log(chordWrapper.id);
    }
      
    return (
        <div
            ref={editableRef}
            className="oac-lyric-segment"
            contentEditable
            onClick={handleFocusViaClick}
            onKeyDown={handleKeyDown}
            onInput={(event) => updateLyric(event.currentTarget.textContent || '')}
        >
        </div>
    );
}

export default LyricSegmentComponent;
