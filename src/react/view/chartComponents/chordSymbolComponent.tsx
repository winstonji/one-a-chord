import React, { useContext, useRef, useEffect } from 'react'
import { ChordWrapper } from '../../model/chordWrapper';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';
import { KeyValue, Key } from '../../model/key';

function ChordSymbolComponent(chordWrapper: ChordWrapper) {

    const {chartService}: {chartService: ChartService} = useContext(ChartContext);
    const editableRef = useRef(null); // Ref for the contentEditable div

	// Test data for chord symbol parsing
	const roots: string[] = ["Gb", "G#", "G", "Db", "D#", "D", 'B'];
	const qualities: string[] = ["maj", "min", "dim", "aug", "halfdim", "sus"];
	const extensions: string[] = ["7", "9", "13", "add2", "b5", "#11", "b13", "alt"];
	const slashes: string[] = roots.map((root) => '/' + root);
	
	// Use negative lookbehind to ensure we don't match roots preceded by a slash
	const rootsPattern = new RegExp(roots.map(root => `(?<!/)${root}`).join('|'), 'g');
	
	// Patterns for qualities and extensions
	const qualitiesPattern = new RegExp(qualities.join('|'), 'g');
	const extensionsPattern = new RegExp(extensions.join('|'), 'g');
	
	// Use positive lookbehind to match only roots that are preceded by a slash
	const slashesPattern = new RegExp(roots.map(root => `(?<=/)${root}`).join('|'), 'g');
	
	let returnRoot: string[] = [];
	let returnQuality: string[] = [];
	let returnExtensions: string[] = [];
	let returnSlash: string[] = [];
	

    useEffect(() => {
        // Set the initial chord symbol content
        if (editableRef.current) {
			editableRef.current.textContent = `${
				chordWrapper?.root?.printName ?? ''
			}${
				chordWrapper?.quality ?? ''
			}${
				chordWrapper?.extensions?.join('') ?? ''
			}${
				chordWrapper?.slash ? '/' + chordWrapper?.slash?.printName : ''}`;
        }
    }, [chordWrapper]);

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
