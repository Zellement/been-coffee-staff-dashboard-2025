import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeSingleTaskFields {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.RichText;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    completedBy?: EntryFieldTypes.Symbol;
    completedOn?: EntryFieldTypes.Date;
}

export type TypeSingleTaskSkeleton = EntrySkeletonType<TypeSingleTaskFields, "singleTask">;
export type TypeSingleTask<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSingleTaskSkeleton, Modifiers, Locales>;
