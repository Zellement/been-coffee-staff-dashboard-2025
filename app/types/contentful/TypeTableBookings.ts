import type { Entry, EntryFields } from "contentful";
import type { TypeLocationFields } from "./TypeLocation";

export interface TypeTableBookingsFields {
    for: EntryFields.Symbol;
    location: Entry<TypeLocationFields>;
    dateTime: EntryFields.Date;
    people: EntryFields.Integer;
    details?: EntryFields.RichText;
}

export type TypeTableBookings = Entry<TypeTableBookingsFields>;
