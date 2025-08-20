import type { Entry, EntryFields } from "contentful";
import type { TypeEmployeeFields } from "./TypeEmployee";
import type { TypeLocationFields } from "./TypeLocation";
import type { TypeSupplierFields } from "./TypeSupplier";

export interface TypeOrderFields {
    supplier: Entry<TypeSupplierFields>;
    orderDate: EntryFields.Date;
    orderedBy: Entry<TypeEmployeeFields>;
    orderedFor: Entry<TypeLocationFields>;
    details?: EntryFields.Text;
}

export type TypeOrder = Entry<TypeOrderFields>;
