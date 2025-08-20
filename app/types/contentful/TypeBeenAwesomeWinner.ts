import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeBeenAwesomeWinnerFields {
    employee: EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>;
    from: EntryFieldTypes.Date;
    details: EntryFieldTypes.Text;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
}

export type TypeBeenAwesomeWinnerSkeleton = EntrySkeletonType<TypeBeenAwesomeWinnerFields, "beenAwesomeWinner">;
export type TypeBeenAwesomeWinner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBeenAwesomeWinnerSkeleton, Modifiers, Locales>;
