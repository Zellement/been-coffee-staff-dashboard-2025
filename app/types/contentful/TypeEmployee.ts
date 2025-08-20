import type { Entry, EntryFields } from "contentful";
import type { TypeImageWithFocalPointFields } from "./TypeImageWithFocalPoint";
import type { TypeRoleFields } from "./TypeRole";

export interface TypeEmployeeFields {
    name: EntryFields.Symbol;
    dateOfBirth?: EntryFields.Date;
    slug?: EntryFields.Symbol;
    history?: EntryFields.Object;
    role: Entry<TypeRoleFields>;
    image?: Entry<TypeImageWithFocalPointFields>[];
}

export type TypeEmployee = Entry<TypeEmployeeFields>;
