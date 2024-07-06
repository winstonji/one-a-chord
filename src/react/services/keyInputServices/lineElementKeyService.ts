
} else if (event.key === 'ArrowRight' && (event.ctrlKey || cursorPosition === contentLength)) {
    const newFocus = lineElement.getNext();
    if (newFocus) {
        if (event.ctrlKey) {
            setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
        } else {
            setCurrentFocus({id: newFocus.lyricSegment.id, position: 0});
        }
        event.preventDefault();
    }
} else if (event.key === 'ArrowLeft' && (event.ctrlKey || cursorPosition === 0)) {
    const newFocus = lineElement.getPrevious();
    if (newFocus) {
        setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
        event.preventDefault();
    } 
} else if (event.key === 'ArrowUp') {
    let newFocus:LineElement
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'PREVIOUS');
        if (newFocus) {
            setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length})
        }
        event.preventDefault();
        return;
    }
    newFocus = FocusFinder.focusUpFrom(lineElement);
    if (newFocus) {
        setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
    }
    event.preventDefault();
} else if (event.key === 'ArrowDown') {
    let newFocus:LineElement;
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent.parent, 'NEXT');
        if (newFocus) {
            setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length})
        }
        event.preventDefault();
        return;
    }
    newFocus = FocusFinder.focusDownFrom(lineElement);
    if (newFocus) {
        setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
    }
    event.preventDefault();
} else if (event.code === 'Home') {
    let newFocus:LineElement;
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusChartStart(chartEditingState.chart);
    } else {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'PREVIOUS_BOUNDED');
    }
    if (newFocus) {
        setCurrentFocus({id: newFocus.lyricSegment.id, position: 0});
    }
} else if (event.code === 'End') {
    let newFocus:LineElement;
    if (event.ctrlKey) {
        newFocus = FocusFinder.focusChartEnd(chartEditingState.chart);
    } else {
        newFocus = FocusFinder.focusBoundExtremity(lineElement, lineElement.parent, 'NEXT_BOUNDED');
    }
    if (newFocus) {
        setCurrentFocus({id: newFocus.lyricSegment.id, position: newFocus.lyricSegment.lyric.length});
    }
