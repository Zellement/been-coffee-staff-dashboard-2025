import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleCategoriesSkeleton } from "./TypeArticleCategories";

export interface TypeArticleFields {
    title: EntryFieldTypes.Symbol;
    subtitle: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    content: EntryFieldTypes.RichText;
    files?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    nextArticle?: EntryFieldTypes.EntryLink<EntrySkeletonType>;
    categories: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeArticleCategoriesSkeleton>>;
}

export type TypeArticleSkeleton = EntrySkeletonType<TypeArticleFields, "article">;
export type TypeArticle<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArticleSkeleton, Modifiers, Locales>;
