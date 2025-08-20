import type { Entry, EntryFields } from "contentful";
import type { TypeSupplierFields } from "./TypeSupplier";

export interface TypeStandingOrderFields {
    supplier: Entry<TypeSupplierFields>;
    frequency: EntryFields.Symbol;
    details?: EntryFields.RichText;
}

export type TypeStandingOrder = Entry<TypeStandingOrderFields>;
