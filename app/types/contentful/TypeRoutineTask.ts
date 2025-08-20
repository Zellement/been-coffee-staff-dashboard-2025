import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleSkeleton } from "./TypeArticle";
import type { TypeRoleSkeleton } from "./TypeRole";

export interface TypeRoutineTaskFields {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.RichText;
    minutesToComplete: EntryFieldTypes.Integer;
    frequencyInDays: EntryFieldTypes.Integer;
    staffLevel?: EntryFieldTypes.EntryLink<TypeRoleSkeleton>;
    article?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeArticleSkeleton>>;
    lastCompleted?: EntryFieldTypes.Date;
}

export type TypeRoutineTaskSkeleton = EntrySkeletonType<TypeRoutineTaskFields, "routineTask">;
export type TypeRoutineTask<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRoutineTaskSkeleton, Modifiers, Locales>;
