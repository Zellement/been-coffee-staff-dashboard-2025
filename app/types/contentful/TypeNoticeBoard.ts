import type { Entry, EntryFields } from "contentful";
import type { TypeLocationFields } from "./TypeLocation";

export interface TypeNoticeBoardFields {
    title: EntryFields.Symbol;
    sticky?: EntryFields.Boolean;
    content: EntryFields.RichText;
    locations: Entry<TypeLocationFields>[];
}

export type TypeNoticeBoard = Entry<TypeNoticeBoardFields>;
