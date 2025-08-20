import type { Entry, EntryFields } from "contentful";
import type { TypeArticleFields } from "./TypeArticle";
import type { TypeRoleFields } from "./TypeRole";

export interface TypeRoutineTasksFields {
    title: EntryFields.Symbol;
    lastCompleted?: EntryFields.Date;
    description: EntryFields.RichText;
    minutesToComplete: EntryFields.Integer;
    frequencyInDays: EntryFields.Integer;
    staffLevel?: Entry<TypeRoleFields>;
    article?: Entry<TypeArticleFields>[];
}

export type TypeRoutineTasks = Entry<TypeRoutineTasksFields>;
