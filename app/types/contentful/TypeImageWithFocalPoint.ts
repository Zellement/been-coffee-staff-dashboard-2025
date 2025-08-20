import type { Asset, Entry, EntryFields } from "contentful";

export interface TypeImageWithFocalPointFields {
    title: EntryFields.Symbol;
    image: Asset;
    focalPoint: EntryFields.Object;
}

export type TypeImageWithFocalPoint = Entry<TypeImageWithFocalPointFields>;
