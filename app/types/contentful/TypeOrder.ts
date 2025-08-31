import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";
import type { TypeLocationSkeleton } from "./TypeLocation";
import type { TypeSupplierSkeleton } from "./TypeSupplier";

export interface TypeOrderFields {
    supplier: EntryFieldTypes.EntryLink<TypeSupplierSkeleton>;
    orderDate: EntryFieldTypes.Date;
    orderedBy: EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    details?: EntryFieldTypes.Text;
    expectedDeliveryDate: EntryFieldTypes.Date;
    deliveryCheckedBy?: EntryFieldTypes.Symbol;
    deliveryCheckedAt?: EntryFieldTypes.Date;
    feedback?: EntryFieldTypes.Text;
}

export type TypeOrderSkeleton = EntrySkeletonType<TypeOrderFields, "order">;
export type TypeOrder<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeOrderSkeleton, Modifiers, Locales>;
