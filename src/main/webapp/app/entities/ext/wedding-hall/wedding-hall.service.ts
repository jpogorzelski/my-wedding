import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';

type EntityResponseType = HttpResponse<IWeddingHall>;
type EntityArrayResponseType = HttpResponse<IWeddingHall[]>;

@Injectable({ providedIn: 'root' })
export class WeddingHallService {
    public resourceUrl = SERVER_API_URL + 'api/wedding-halls';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/wedding-halls';

    constructor(protected http: HttpClient) {}

    create(weddingHall: IWeddingHall): Observable<EntityResponseType> {
        return this.http.post<IWeddingHall>(this.resourceUrl, weddingHall, { observe: 'response' });
    }

    update(weddingHall: IWeddingHall): Observable<EntityResponseType> {
        return this.http.put<IWeddingHall>(this.resourceUrl, weddingHall, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IWeddingHall>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IWeddingHall[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IWeddingHall[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
