export interface KeyValue {
    ordinal: number;
    printName: string;
}
  

export class Key {
    // We are using Object.freeze so the values here cannot be changed. Since they are static and shared globally, this prevents you from doing something like:
    // Key.Cs.printName = "you are a loser". 
    public static readonly none: KeyValue = Object.freeze({ ordinal: -1, printName: "" });
    public static readonly Cs: KeyValue = Object.freeze({ ordinal: 0, printName: "C" });
    public static readonly Db: KeyValue = Object.freeze({ ordinal: 1, printName: "Db" });
    public static readonly Ds: KeyValue = Object.freeze({ ordinal: 2, printName: "D" });
    public static readonly Eb: KeyValue = Object.freeze({ ordinal: 3, printName: "Eb" });
    public static readonly Es: KeyValue = Object.freeze({ ordinal: 4, printName: "E" });
    public static readonly Fb: KeyValue = Object.freeze({ ordinal: 5, printName: "Fb" });
    public static readonly Fs: KeyValue = Object.freeze({ ordinal: 6, printName: "F" });
    public static readonly Gb: KeyValue = Object.freeze({ ordinal: 7, printName: "Gb" });
    public static readonly Gs: KeyValue = Object.freeze({ ordinal: 8, printName: "G" });
    public static readonly Ab: KeyValue = Object.freeze({ ordinal: 9, printName: "Ab" });
    public static readonly As: KeyValue = Object.freeze({ ordinal: 10, printName: "A" });
    public static readonly Bb: KeyValue = Object.freeze({ ordinal: 11, printName: "Bb" });
    public static readonly Bs: KeyValue = Object.freeze({ ordinal: 12, printName: "B" });

    // Make the constructor private to prevent instantiation
    private constructor() {}

    public static getKeyValueByPrintName(printName: string): KeyValue | undefined {
        // Iterate over all properties of the Key class
        for (const key of Object.keys(Key)) {
            // Check if the property is an instance of KeyValue
            const keyValue = (Key as any)[key];
            if (keyValue.printName === printName) {
                return keyValue;
            }
        }
        // Return undefined if no match is found
        return undefined;
    }
}