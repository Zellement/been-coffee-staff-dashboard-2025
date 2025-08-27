import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";
import type { TypeRoleSkeleton } from "./TypeRole";

export interface TypeEmployeeFields {
    name: EntryFieldTypes.Symbol;
    surname: EntryFieldTypes.Symbol;
    primaryLocation?: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    role: EntryFieldTypes.EntryLink<TypeRoleSkeleton>;
    photo?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    dateOfBirth?: EntryFieldTypes.Date;
    startDate?: EntryFieldTypes.Date;
    homebaseUserId: EntryFieldTypes.Symbol;
    tillPin?: EntryFieldTypes.Symbol;
    history?: EntryFieldTypes.Object;
}

export type TypeEmployeeSkeleton = EntrySkeletonType<TypeEmployeeFields, "employee">;
export type TypeEmployee<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeEmployeeSkeleton, Modifiers, Locales>;
