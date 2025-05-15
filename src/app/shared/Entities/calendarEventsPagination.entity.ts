import { CalendarEventsEntity } from "./calendarEvents.entity";

export class CalendarEventsPaginationEntity {
    id?: string | number;
    pageNumber: number;
    pageSize: number;
    params: CalendarEventsEntity;
    sortDirection: number;
    sortField: string;
    resultsEvents: CalendarEventsEntity[];
    totalPages: number;
    totalElements: number;

    constructor() {

    }   
}