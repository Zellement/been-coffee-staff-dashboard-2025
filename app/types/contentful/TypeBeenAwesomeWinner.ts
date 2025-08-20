import type { Entry, EntryFields } from "contentful";
import type { TypeEmployeeFields } from "./TypeEmployee";
import type { TypeLocationFields } from "./TypeLocation";

export interface TypeBeenAwesomeWinnerFields {
    employee: Entry<TypeEmployeeFields>;
    from: EntryFields.Date;
    details: EntryFields.Text;
    location: Entry<TypeLocationFields>;
}

export type TypeBeenAwesomeWinner = Entry<TypeBeenAwesomeWinnerFields>;
