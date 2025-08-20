import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeTableBookingsFields {
    for: EntryFieldTypes.Symbol;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    dateTime: EntryFieldTypes.Date;
    people: EntryFieldTypes.Integer;
    details?: EntryFieldTypes.RichText;
}

export type TypeTableBookingsSkeleton = EntrySkeletonType<TypeTableBookingsFields, "tableBookings">;
export type TypeTableBookings<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTableBookingsSkeleton, Modifiers, Locales>;
