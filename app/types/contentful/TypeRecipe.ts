import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeRecipeCategoriesSkeleton } from "./TypeRecipeCategories";

export interface TypeRecipeFields {
    title: EntryFieldTypes.Symbol;
    subtitle?: EntryFieldTypes.Symbol;
    yearIntroduced: EntryFieldTypes.Integer;
    media?: EntryFieldTypes.AssetLink;
    ingredients?: EntryFieldTypes.Object;
    instructions?: EntryFieldTypes.RichText;
    category: EntryFieldTypes.EntryLink<TypeRecipeCategoriesSkeleton>;
    slug: EntryFieldTypes.Symbol;
}

export type TypeRecipeSkeleton = EntrySkeletonType<TypeRecipeFields, "recipe">;
export type TypeRecipe<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRecipeSkeleton, Modifiers, Locales>;
