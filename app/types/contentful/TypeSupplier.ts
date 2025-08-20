import type { Entry, EntryFields } from "contentful";

export interface TypeSupplierFields {
    name: EntryFields.Symbol;
}

export type TypeSupplier = Entry<TypeSupplierFields>;
