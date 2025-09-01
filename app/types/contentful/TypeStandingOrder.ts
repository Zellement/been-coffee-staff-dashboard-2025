import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";
import type { TypeSupplierSkeleton } from "./TypeSupplier";

export interface TypeStandingOrderFields {
    supplier: EntryFieldTypes.EntryLink<TypeSupplierSkeleton>;
    frequency: EntryFieldTypes.Symbol;
    details?: EntryFieldTypes.RichText;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
}

export type TypeStandingOrderSkeleton = EntrySkeletonType<TypeStandingOrderFields, "standingOrder">;
export type TypeStandingOrder<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeStandingOrderSkeleton, Modifiers, Locales>;
