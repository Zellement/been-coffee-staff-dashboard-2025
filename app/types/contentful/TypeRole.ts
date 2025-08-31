import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeRoleFields {
    title: EntryFieldTypes.Symbol;
    isManagementOrLeadRole: EntryFieldTypes.Boolean;
}

export type TypeRoleSkeleton = EntrySkeletonType<TypeRoleFields, "role">;
export type TypeRole<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRoleSkeleton, Modifiers, Locales>;
