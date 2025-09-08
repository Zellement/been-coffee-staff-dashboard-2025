import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleCategoriesSkeleton } from "./TypeArticleCategories";

export interface TypeArticleFields {
    title: EntryFieldTypes.Symbol;
    subtitle: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    files?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    nextArticle?: EntryFieldTypes.EntryLink<TypeArticleSkeleton>;
    category: EntryFieldTypes.EntryLink<TypeArticleCategoriesSkeleton>;
    content: EntryFieldTypes.RichText;
}

export type TypeArticleSkeleton = EntrySkeletonType<TypeArticleFields, "article">;
export type TypeArticle<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArticleSkeleton, Modifiers, Locales>;
