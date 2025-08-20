import type { Entry, EntryFields } from "contentful";
import type { TypeEmployeeFields } from "./TypeEmployee";

export interface TypeLocationFields {
    postcode?: EntryFields.Symbol;
    employees: Entry<TypeEmployeeFields>[];
}

export type TypeLocation = Entry<TypeLocationFields>;
