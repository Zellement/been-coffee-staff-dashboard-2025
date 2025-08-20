import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleSkeleton } from "./TypeArticle";
import type { TypeRoleSkeleton } from "./TypeRole";

export interface TypeRoutineTasksFields {
    title: EntryFieldTypes.Symbol;
    lastCompleted?: EntryFieldTypes.Date;
    description: EntryFieldTypes.RichText;
    minutesToComplete: EntryFieldTypes.Integer;
    frequencyInDays: EntryFieldTypes.Integer;
    staffLevel?: EntryFieldTypes.EntryLink<TypeRoleSkeleton>;
    article?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeArticleSkeleton>>;
}

export type TypeRoutineTasksSkeleton = EntrySkeletonType<TypeRoutineTasksFields, "routineTasks">;
export type TypeRoutineTasks<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRoutineTasksSkeleton, Modifiers, Locales>;
