import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeLocationFields {
    postcode?: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    temperatureLoggingItemsBar: EntryFieldTypes.Object;
    temperatureLoggingItemsBack: EntryFieldTypes.Object;
    googleSheetsScriptTemperatureLogs?: EntryFieldTypes.Symbol;
    googleSheetsScriptCashBreakdown?: EntryFieldTypes.Symbol;
    googleSheetsScriptRoutineTasks?: EntryFieldTypes.Symbol;
}

export type TypeLocationSkeleton = EntrySkeletonType<TypeLocationFields, "location">;
export type TypeLocation<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLocationSkeleton, Modifiers, Locales>;
