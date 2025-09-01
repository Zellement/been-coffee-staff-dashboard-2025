import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeTeamHierarchyFields {
    teamFor?: EntryFieldTypes.Symbol<"de65" | "ng10">;
}

export type TypeTeamHierarchySkeleton = EntrySkeletonType<TypeTeamHierarchyFields, "teamHierarchy">;
export type TypeTeamHierarchy<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTeamHierarchySkeleton, Modifiers, Locales>;
