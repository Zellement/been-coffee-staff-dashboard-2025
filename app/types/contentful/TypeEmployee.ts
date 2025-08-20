import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeImageWithFocalPointSkeleton } from "./TypeImageWithFocalPoint";
import type { TypeRoleSkeleton } from "./TypeRole";

export interface TypeEmployeeFields {
    name: EntryFieldTypes.Symbol;
    dateOfBirth?: EntryFieldTypes.Date;
    slug?: EntryFieldTypes.Symbol;
    history?: EntryFieldTypes.Object;
    role: EntryFieldTypes.EntryLink<TypeRoleSkeleton>;
    image?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeImageWithFocalPointSkeleton>>;
}

export type TypeEmployeeSkeleton = EntrySkeletonType<TypeEmployeeFields, "employee">;
export type TypeEmployee<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeEmployeeSkeleton, Modifiers, Locales>;
