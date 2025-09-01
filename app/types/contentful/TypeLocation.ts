import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeEmployeeSkeleton } from "./TypeEmployee";

export interface TypeLocationFields {
    postcode?: EntryFieldTypes.Symbol;
    teamHierarchy: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEmployeeSkeleton>>;
    temperatureLoggingItemsBar: EntryFieldTypes.Object;
    temperatureLoggingItemsBack: EntryFieldTypes.Object;
    googleSheetsScriptTemperatureLogs?: EntryFieldTypes.Symbol;
    googleSheetsScriptCashBreakdown?: EntryFieldTypes.Symbol;
    googleSheetsScriptRoutineTasks?: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    googlePlaceId?: EntryFieldTypes.Symbol;
    tripadvisorPlaceId?: EntryFieldTypes.Symbol;
    reviewDataLastFetched?: EntryFieldTypes.Date;
    reviewData?: EntryFieldTypes.Object;
}

export type TypeLocationSkeleton = EntrySkeletonType<TypeLocationFields, "location">;
export type TypeLocation<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLocationSkeleton, Modifiers, Locales>;
