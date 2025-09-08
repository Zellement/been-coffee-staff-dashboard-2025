import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeBeenAwesomeWinnerFields {
    name: EntryFieldTypes.Symbol;
    photo?: EntryFieldTypes.AssetLink;
    from: EntryFieldTypes.Date;
    details: EntryFieldTypes.Text;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
}

export type TypeBeenAwesomeWinnerSkeleton = EntrySkeletonType<TypeBeenAwesomeWinnerFields, "beenAwesomeWinner">;
export type TypeBeenAwesomeWinner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBeenAwesomeWinnerSkeleton, Modifiers, Locales>;
