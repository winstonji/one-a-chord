import React, { useContext, useRef, useEffect } from 'react'
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';

function ChordSymbolComponent(chordWrapper: ChordWrapper) {

    const {chartService}: {chartService: ChartService} = useContext(ChartContext);
    const editableRef = useRef(null); // Ref for the contentEditable div

    useEffect(() => {
        // Set the initial chord symbol content
        if (editableRef.current) {
            editableRef.current.textContent = chordWrapper.backingString;
        }
    }, [chordWrapper.backingString]);

    const updateChordSymbol = (updatedSymbol: string) => {
        // Save the cursor position before updating the state
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        const startOffset = range ? range.startOffset : 0;

        chartService.updateChord(updatedSymbol, chordWrapper);

        // Restore the cursor position after the state update
        if (editableRef.current && range) {
            const newRange = document.createRange();
            newRange.setStart(editableRef.current.childNodes[0] || editableRef.current, startOffset);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    }; 

    return (
        <div
            ref={editableRef}
            className="oac-chord-symbol"
            contentEditable
            onInput={(event) => {updateChordSymbol(event.currentTarget.textContent || '')}}
        >
        </div>
    );
}

export default ChordSymbolComponent;
