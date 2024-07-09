export interface CurrentFocus{
    id: string;
    position: number;
}

export type UpdateCurrentFocusProps = Partial<CurrentFocus>;

export class ConstantFocusIds{
    public static readonly TITLE = Object.freeze("TITLE");
    public static readonly KEY = Object.freeze("KEY");
    public static readonly TIME_UPPER = Object.freeze("TIME_UPPER");
    public static readonly TIME_LOWER = Object.freeze("TIME_LOWER");
    public static readonly TEMPO = Object.freeze("TEMPO");
}