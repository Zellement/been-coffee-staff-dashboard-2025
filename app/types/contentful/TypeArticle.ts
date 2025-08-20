import type { Entry, EntryFields } from "contentful";

export interface TypeArticleFields {
    title: EntryFields.Symbol;
    slug: EntryFields.Symbol;
}

export type TypeArticle = Entry<TypeArticleFields>;
