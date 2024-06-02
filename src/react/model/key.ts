export interface KeyValue {
    ordinal: number;
    printName: string;
}
  

export class Key {
    public static Cs: KeyValue = { ordinal: 0, printName: "C" };
    public static Db: KeyValue = { ordinal: 1, printName: "Db" };
    public static Ds: KeyValue = { ordinal: 2, printName: "D" };
    public static Eb: KeyValue = { ordinal: 3, printName: "Eb" };
    public static Es: KeyValue = { ordinal: 4, printName: "E" };
    public static Fb: KeyValue = { ordinal: 5, printName: "Fb" };
    public static Fs: KeyValue = { ordinal: 6, printName: "F" };
    public static Gb: KeyValue = { ordinal: 7, printName: "Gb" };
    public static Gs: KeyValue = { ordinal: 8, printName: "G" };
    public static Ab: KeyValue = { ordinal: 9, printName: "Ab" };
    public static As: KeyValue = { ordinal: 10, printName: "A" };
    public static Bb: KeyValue = { ordinal: 11, printName: "Bb" };
    public static Bs: KeyValue = { ordinal: 12, printName: "B" };
}
  