export function parseChordSymbol(unparsedString: string, pattern: RegExp): string[] {
    const subSymbols: string[] = [];
    
    unparsedString.replace(pattern, (match) => {
        subSymbols.push(match);
        return match;
    });

    return subSymbols;
}

export function hasDuplicates(array: any[]): boolean {
    const uniqueElements = new Set(array);
    return uniqueElements.size !== array.length;
}	  