import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class Register {
    constructor(private http: HttpClient) {}

    saveCustomer(account: any): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/register', account);
    }

    saveCompany(account: any): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/register-business', account);
    }
}
