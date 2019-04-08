import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOffer } from 'app/shared/model/offer.model';

type EntityResponseType = HttpResponse<IOffer>;
type EntityArrayResponseType = HttpResponse<IOffer[]>;

@Injectable({ providedIn: 'root' })
export class OfferService {
    public resourceUrl = SERVER_API_URL + 'api/offers';

    constructor(protected http: HttpClient) {}

    create(offer: IOffer): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(offer);
        return this.http
            .post<IOffer>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(offer: IOffer): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(offer);
        return this.http
            .put<IOffer>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IOffer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IOffer[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(offer: IOffer): IOffer {
        const copy: IOffer = Object.assign({}, offer, {
            eventDate: offer.eventDate != null && offer.eventDate.isValid() ? offer.eventDate.toJSON() : null,
            startDate: offer.startDate != null && offer.startDate.isValid() ? offer.startDate.format(DATE_FORMAT) : null,
            endDate: offer.endDate != null && offer.endDate.isValid() ? offer.endDate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.eventDate = res.body.eventDate != null ? moment(res.body.eventDate) : null;
            res.body.startDate = res.body.startDate != null ? moment(res.body.startDate) : null;
            res.body.endDate = res.body.endDate != null ? moment(res.body.endDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((offer: IOffer) => {
                offer.eventDate = offer.eventDate != null ? moment(offer.eventDate) : null;
                offer.startDate = offer.startDate != null ? moment(offer.startDate) : null;
                offer.endDate = offer.endDate != null ? moment(offer.endDate) : null;
            });
        }
        return res;
    }
}
