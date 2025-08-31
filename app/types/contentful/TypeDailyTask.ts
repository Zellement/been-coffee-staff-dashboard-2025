import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeDailyTaskFields {
    title: EntryFieldTypes.Symbol;
    dueByHour: EntryFieldTypes.Integer;
    description: EntryFieldTypes.RichText;
    article?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>;
    completeVia?: EntryFieldTypes.Symbol;
}

export type TypeDailyTaskSkeleton = EntrySkeletonType<TypeDailyTaskFields, "dailyTask">;
export type TypeDailyTask<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeDailyTaskSkeleton, Modifiers, Locales>;
