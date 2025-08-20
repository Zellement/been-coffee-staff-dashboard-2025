import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeSupplierFields {
    name: EntryFieldTypes.Symbol;
}

export type TypeSupplierSkeleton = EntrySkeletonType<TypeSupplierFields, "supplier">;
export type TypeSupplier<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSupplierSkeleton, Modifiers, Locales>;
