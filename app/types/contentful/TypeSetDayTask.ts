import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeSetDayTaskFields {
    title: EntryFieldTypes.Symbol;
    day: EntryFieldTypes.Symbol<"Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday">;
    time: EntryFieldTypes.Integer;
    description: EntryFieldTypes.RichText;
    whoCanComplete: EntryFieldTypes.Symbol;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    completedBy?: EntryFieldTypes.Symbol;
    lastCompleted?: EntryFieldTypes.Date;
}

export type TypeSetDayTaskSkeleton = EntrySkeletonType<TypeSetDayTaskFields, "setDayTask">;
export type TypeSetDayTask<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSetDayTaskSkeleton, Modifiers, Locales>;
