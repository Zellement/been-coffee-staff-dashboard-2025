import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeTableBookingFields {
    name: EntryFieldTypes.Symbol;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    dateTime: EntryFieldTypes.Date;
    people: EntryFieldTypes.Integer;
    details?: EntryFieldTypes.RichText;
}

export type TypeTableBookingSkeleton = EntrySkeletonType<TypeTableBookingFields, "tableBooking">;
export type TypeTableBooking<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTableBookingSkeleton, Modifiers, Locales>;
