export class SelectionUtil{
    public static getCursorPos(): number{
        const selection = window.getSelection();
    
        if (!selection.rangeCount) {
            return 0;
        }
        
        const range = selection.getRangeAt(0);
        return range.startOffset;
    }
    
    public static setCursorPos(textNode: ChildNode, cursorPosition: number) {
        const selection: Selection = window.getSelection();
        const updatedPosition: Range = document.createRange();
        updatedPosition.setStart(textNode, cursorPosition);
        updatedPosition.setEnd(textNode, cursorPosition);
        selection.removeAllRanges();
        selection.addRange(updatedPosition);
    }
}
