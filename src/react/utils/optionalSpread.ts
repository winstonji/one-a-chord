export function optionalSpread<T>(target: T, source: Partial<T>): T {
    return { ...target, ...source };
}