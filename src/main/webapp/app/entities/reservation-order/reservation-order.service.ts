import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';

type EntityResponseType = HttpResponse<IReservationOrder>;
type EntityArrayResponseType = HttpResponse<IReservationOrder[]>;

@Injectable({ providedIn: 'root' })
export class ReservationOrderService {
    public resourceUrl = SERVER_API_URL + 'api/reservation-orders';

    constructor(protected http: HttpClient) {}

    create(reservationOrder: IReservationOrder): Observable<EntityResponseType> {
        reservationOrder.createDate = moment();
        reservationOrder.modificationDate = moment();
        reservationOrder.downPaymentSettled = false;
        reservationOrder.reservationConfirmed = false;

        const copy = this.convertDateFromClient(reservationOrder);
        return this.http
            .post<IReservationOrder>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(reservationOrder: IReservationOrder): Observable<EntityResponseType> {
        reservationOrder.modificationDate = moment();
        const copy = this.convertDateFromClient(reservationOrder);
        return this.http
            .put<IReservationOrder>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IReservationOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    findByOffer(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IReservationOrder>(`${this.resourceUrl}/offer/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IReservationOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(reservationOrder: IReservationOrder): IReservationOrder {
        const copy: IReservationOrder = Object.assign({}, reservationOrder, {
            createDate:
                reservationOrder.createDate != null && reservationOrder.createDate.isValid()
                    ? reservationOrder.createDate.format(DATE_FORMAT)
                    : null,
            modificationDate:
                reservationOrder.modificationDate != null && reservationOrder.modificationDate.isValid()
                    ? reservationOrder.modificationDate.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.createDate = res.body.createDate != null ? moment(res.body.createDate) : null;
            res.body.modificationDate = res.body.modificationDate != null ? moment(res.body.modificationDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((reservationOrder: IReservationOrder) => {
                reservationOrder.createDate = reservationOrder.createDate != null ? moment(reservationOrder.createDate) : null;
                reservationOrder.modificationDate =
                    reservationOrder.modificationDate != null ? moment(reservationOrder.modificationDate) : null;
            });
        }
        return res;
    }
}
