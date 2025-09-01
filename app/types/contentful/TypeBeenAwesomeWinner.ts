import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeBeenAwesomeWinnerFields {
    name: EntryFieldTypes.Symbol;
    photo?: EntryFieldTypes.AssetLink;
    employee?: EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>;
    from: EntryFieldTypes.Date;
    details: EntryFieldTypes.Text;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
}

export type TypeBeenAwesomeWinnerSkeleton = EntrySkeletonType<TypeBeenAwesomeWinnerFields, "beenAwesomeWinner">;
export type TypeBeenAwesomeWinner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBeenAwesomeWinnerSkeleton, Modifiers, Locales>;
