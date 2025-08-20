import type { Entry, EntryFields } from "contentful";

export interface TypeRoleFields {
    title: EntryFields.Symbol;
}

export type TypeRole = Entry<TypeRoleFields>;
