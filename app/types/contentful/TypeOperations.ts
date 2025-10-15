import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";

export interface TypeOperationsFields {
    entryTitle: EntryFieldTypes.Symbol;
    leadership: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
}

export type TypeOperationsSkeleton = EntrySkeletonType<TypeOperationsFields, "operations">;
export type TypeOperations<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeOperationsSkeleton, Modifiers, Locales>;
