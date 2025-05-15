import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AcmURLConstants} from 'src/app/shared/acm-url-constants';
import {CalendarEventsEntity} from 'src/app/shared/Entities/calendarEvents.entity';
import { CalendarEventsPaginationEntity } from 'src/app/shared/Entities/calendarEventsPagination.entity';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  constructor(public httpClient: HttpClient) {
  }

  /**
   * find by given params
   * @param calendarEventsEntity the calendarEventsEntity
   */
  find(calendarEventsEntity: CalendarEventsEntity): Observable<CalendarEventsEntity[]> {
    return this.httpClient.post<CalendarEventsEntity[]>(AcmURLConstants.CALENDAR_EVENT_FIND, calendarEventsEntity);
  }

    /**
   * find pagination by given params
   * @param calendarEventsEntity the calendarEventsEntity
   */
    findPagination(calendarEventsPaginationEntity: CalendarEventsPaginationEntity): Observable<CalendarEventsPaginationEntity> {
      return this.httpClient.post<CalendarEventsPaginationEntity>(AcmURLConstants.CALENDAR_EVENT_FIND_PAGINATION, calendarEventsPaginationEntity);
    }

  /**
   * update
   * @param calendarEventsEntity the calendarEventsEntity
   */
  update(calendarEventsEntity: CalendarEventsEntity) {
    return this.httpClient.put<CalendarEventsEntity>(AcmURLConstants.CALENDAR_EVENT_UPDATE, calendarEventsEntity);
  }

  /**
   * create
   * @param calendarEventsEntity the calendarEventsEntity
   */
  create(calendarEventsEntity: CalendarEventsEntity) {
    return this.httpClient.post<CalendarEventsEntity>(AcmURLConstants.CALENDAR_EVENT_CREATE, calendarEventsEntity);
  }

  /**
   * delete
   * @param id the id
   */
  delete(id: string): Observable<CalendarEventsEntity[]> {
    return this.httpClient.delete<CalendarEventsEntity[]>(AcmURLConstants.CALENDAR_EVENT_FIND + id);
  }

  /**
   * findCalendarEventById
   * @param id the id
   */
  findById(id: string): Observable<CalendarEventsEntity[]> {
    return this.httpClient.get<CalendarEventsEntity[]>(AcmURLConstants.CALENDAR_EVENT_FIND + id);
  }

  closeTask(calendarEventsEntity: CalendarEventsEntity) {
    return this.httpClient.put<CalendarEventsEntity>(AcmURLConstants.CALENDAR_EVENT_CLOSE, calendarEventsEntity);
  }

}
