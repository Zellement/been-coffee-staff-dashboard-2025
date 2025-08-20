import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";

export interface TypeLocationFields {
    postcode?: EntryFieldTypes.Symbol;
    employees: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
}

export type TypeLocationSkeleton = EntrySkeletonType<TypeLocationFields, "location">;
export type TypeLocation<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLocationSkeleton, Modifiers, Locales>;
