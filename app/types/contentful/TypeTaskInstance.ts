import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeDailyTaskSkeleton } from "./TypeDailyTask";
import type { TypeLocationSkeleton } from "./TypeLocation";
import type { TypeRoutineTaskSkeleton } from "./TypeRoutineTask";

export interface TypeTaskInstanceFields {
    title?: EntryFieldTypes.Symbol;
    task: EntryFieldTypes.EntryLink<TypeDailyTaskSkeleton | TypeRoutineTaskSkeleton>;
    location: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    lastCompleted?: EntryFieldTypes.Date;
}

export type TypeTaskInstanceSkeleton = EntrySkeletonType<TypeTaskInstanceFields, "taskInstance">;
export type TypeTaskInstance<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTaskInstanceSkeleton, Modifiers, Locales>;
