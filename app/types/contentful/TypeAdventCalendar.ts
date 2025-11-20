import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeAdventCalendarFields {
    title: EntryFieldTypes.Symbol;
    location?: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    winner1st?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner2nd?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner3rd?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner4th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
}

export type TypeAdventCalendarSkeleton = EntrySkeletonType<TypeAdventCalendarFields, "adventCalendar">;
export type TypeAdventCalendar<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAdventCalendarSkeleton, Modifiers, Locales>;
