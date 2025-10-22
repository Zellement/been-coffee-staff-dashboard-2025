import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLocationSkeleton } from "./TypeLocation";

export interface TypeEmployeeFields {
    name: EntryFieldTypes.Symbol;
    surname: EntryFieldTypes.Symbol;
    primaryLocation: EntryFieldTypes.EntryLink<TypeLocationSkeleton>;
    jobRole: EntryFieldTypes.Symbol<"Assistant Manager" | "Barista" | "Director" | "Manager" | "Shift Lead" | "Support" | "_DashLogin" | "_ShopLogin">;
    jobRoleAddendum?: EntryFieldTypes.Symbol;
    photo?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    dateOfBirth?: EntryFieldTypes.Date;
    startDate?: EntryFieldTypes.Date;
    tillPin?: EntryFieldTypes.Symbol;
    rotareadyId: EntryFieldTypes.Integer;
    history?: EntryFieldTypes.Object;
}

export type TypeEmployeeSkeleton = EntrySkeletonType<TypeEmployeeFields, "employee">;
export type TypeEmployee<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeEmployeeSkeleton, Modifiers, Locales>;
