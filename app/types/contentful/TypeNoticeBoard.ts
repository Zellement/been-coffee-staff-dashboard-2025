import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeNoticeBoardFields {
    title: EntryFieldTypes.Symbol;
    sticky: EntryFieldTypes.Boolean;
    content: EntryFieldTypes.RichText;
    locations: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLocationSkeleton>>;
    author: EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>;
}

export type TypeNoticeBoardSkeleton = EntrySkeletonType<TypeNoticeBoardFields, "noticeBoard">;
export type TypeNoticeBoard<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNoticeBoardSkeleton, Modifiers, Locales>;
