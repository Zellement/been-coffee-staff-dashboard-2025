import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeRecipeCategoriesFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
}

export type TypeRecipeCategoriesSkeleton = EntrySkeletonType<TypeRecipeCategoriesFields, "recipeCategories">;
export type TypeRecipeCategories<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRecipeCategoriesSkeleton, Modifiers, Locales>;
