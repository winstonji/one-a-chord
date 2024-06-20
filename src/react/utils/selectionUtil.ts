export function getCursorPos(): number{
    const selection = window.getSelection();

    if (!selection.rangeCount) {
        return 0;
    }
    
    const range = selection.getRangeAt(0);
    return range.startOffset;
}