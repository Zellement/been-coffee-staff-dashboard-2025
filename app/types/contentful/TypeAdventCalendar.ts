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
    winner5th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner6th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner7th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner8th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner9th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner10th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner11th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner12th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner13th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner14th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner15th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner16th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner17th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner18th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner19th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner20th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner21st?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner22nd?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner23rd?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    winner24th?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
}

export type TypeAdventCalendarSkeleton = EntrySkeletonType<TypeAdventCalendarFields, "adventCalendar">;
export type TypeAdventCalendar<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAdventCalendarSkeleton, Modifiers, Locales>;
