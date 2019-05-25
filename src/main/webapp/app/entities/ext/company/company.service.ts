import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICompany } from 'app/shared/model/company.model';
import { IOffer } from 'app/shared/model/offer.model';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';

type EntityResponseType = HttpResponse<ICompany>;
type EntityArrayResponseType = HttpResponse<ICompany[]>;

@Injectable({ providedIn: 'root' })
export class CompanyService {
    public resourceUrl = SERVER_API_URL + 'api/companies';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/companies';

    constructor(protected http: HttpClient) {}

    create(company: ICompany): Observable<EntityResponseType> {
        return this.http.post<ICompany>(this.resourceUrl, company, { observe: 'response' });
    }

    update(company: ICompany): Observable<EntityResponseType> {
        return this.http.put<ICompany>(this.resourceUrl, company, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICompany>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICompany[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICompany[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }

    current(req?: any): Observable<EntityResponseType> {
        return this.http.get<ICompany>(`${this.resourceUrl}/current`, { observe: 'response' });
    }

    currentWeddingHalls(req?: any): Observable<HttpResponse<IWeddingHall[]>> {
        return this.http.get<IWeddingHall[]>(`${this.resourceUrl}/current/wedding-halls`, { observe: 'response' });
    }

    currentOffers(req?: any): Observable<HttpResponse<IOffer[]>> {
        return this.http.get<IOffer[]>(`${this.resourceUrl}/current/offers`, { observe: 'response' });
    }

    currentReservationOrders(req?: any): Observable<HttpResponse<IReservationOrder[]>> {
        return this.http.get<IReservationOrder[]>(`${this.resourceUrl}/current/reservation-orders`, { observe: 'response' });
    }

    updateCurrent(company: ICompany): Observable<EntityResponseType> {
        return this.http.put<ICompany>(this.resourceUrl, company, { observe: 'response' });
    }
}
