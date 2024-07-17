import React, { useContext, useRef, useEffect } from 'react';
import { LineElement } from '../../model/lineElement';
import { ChartContext } from '../programWindow';
import { ChartService } from '../../services/chartService';
import { SelectionUtil } from '../../utils/selectionUtil';
import { LyricSegmentKeyService } from '../../services/keyInputServices/lyricSegmentKeyService';

function LyricSegmentComponent(lineElement: LineElement) {
    
    const {chartEditingState, setChartEditingState, setCurrentFocus, undoRef}= useContext(ChartContext);
    const editableRef = useRef<HTMLDivElement>(null); // Ref for the contentEditable div

    const currentFocus = chartEditingState.currentFocus;

    useEffect(() => {
        // Set the initial lyric content
        if (editableRef.current) {
            editableRef.current.textContent = lineElement.lyricSegment.lyric;

            if(currentFocus.id === lineElement.lyricSegment.id){
                editableRef.current.focus();
                
                const textNode = editableRef.current.childNodes[0];
                if (textNode) {
                    SelectionUtil.setCursorPos(textNode, currentFocus.position);
                }
            }
        }
    });

    const updateLyric = (updatedLyric: string) => {
        setChartEditingState((chartEditingState) => {
            const chartService = ChartService.with(chartEditingState.chart);
            chartService.updateLyric(lineElement, updatedLyric);
        
            return {
                chart: chartService.finalize(),
                currentFocus: {
                    ...chartEditingState.currentFocus,
                    position: SelectionUtil.getCursorPos()
                }
            };
        })
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const cursorPosition = SelectionUtil.getCursorPos();
        const contentLength = editableRef.current.textContent.length;    

        setChartEditingState((chartEditingState) => {
            const lyricSegmentKeyService = new LyricSegmentKeyService(chartEditingState, undoRef.current);
            return lyricSegmentKeyService.handleLyricSegmentKeyDown(
                                             event,
                                             lineElement,
                                             cursorPosition,
                                             contentLength
                                        );
        });
    };
    

    //This keeps the current focus in sync with the cursor in the DOM when you click an element.
    //Otherwise when you start typing, the cursor will jump to an incorrect position because the current focus state is wrong.
    const handleFocusViaClick = () => {
        setCurrentFocus({id: lineElement.lyricSegment.id, position: SelectionUtil.getCursorPos()});
    }
      
    return (
        <div
            ref={editableRef}
            className="oac-lyric-segment"
            contentEditable
            onClick={handleFocusViaClick}
            onKeyDown={handleKeyDown}
            onInput={(event) => updateLyric(event.currentTarget.textContent || '')}
            tabIndex={-1}
        >
        </div>
    );
}

export default LyricSegmentComponent;
