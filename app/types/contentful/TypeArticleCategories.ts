import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeArticleCategoriesFields {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    icon?: EntryFieldTypes.Symbol;
}

export type TypeArticleCategoriesSkeleton = EntrySkeletonType<TypeArticleCategoriesFields, "articleCategories">;
export type TypeArticleCategories<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArticleCategoriesSkeleton, Modifiers, Locales>;
