import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEventDate } from 'app/shared/model/event-date.model';

type EntityResponseType = HttpResponse<IEventDate>;
type EntityArrayResponseType = HttpResponse<IEventDate[]>;

@Injectable({ providedIn: 'root' })
export class EventDateService {
    public resourceUrl = SERVER_API_URL + 'api/event-dates';

    constructor(protected http: HttpClient) {}

    create(eventDate: IEventDate): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventDate);
        return this.http
            .post<IEventDate>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(eventDate: IEventDate): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventDate);
        return this.http
            .put<IEventDate>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IEventDate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventDate[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(eventDate: IEventDate): IEventDate {
        const copy: IEventDate = Object.assign({}, eventDate, {
            date: eventDate.date != null && eventDate.date.isValid() ? eventDate.date.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((eventDate: IEventDate) => {
                eventDate.date = eventDate.date != null ? moment(eventDate.date) : null;
            });
        }
        return res;
    }
}
