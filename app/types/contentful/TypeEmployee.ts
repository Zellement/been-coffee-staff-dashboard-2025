import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeImageWithFocalPointSkeleton } from "./TypeImageWithFocalPoint";
import type { TypeLocationSkeleton } from "./TypeLocation";
import type { TypeRoleSkeleton } from "./TypeRole";

export interface TypeEmployeeFields {
    name: EntryFieldTypes.Symbol;
    surname: EntryFieldTypes.Symbol;
    dateOfBirth?: EntryFieldTypes.Date;
    primaryLocation?: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    role: EntryFieldTypes.EntryLink<TypeRoleSkeleton>;
    photo?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    image?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeImageWithFocalPointSkeleton>>;
    history?: EntryFieldTypes.Object;
    slug?: EntryFieldTypes.Symbol;
}

export type TypeEmployeeSkeleton = EntrySkeletonType<TypeEmployeeFields, "employee">;
export type TypeEmployee<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeEmployeeSkeleton, Modifiers, Locales>;
