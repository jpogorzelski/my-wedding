import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from './customer.service';
import { IUser, UserService } from 'app/core';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';
import { IProvince } from 'app/shared/model/province.model';
import { ProvinceService } from 'app/entities/province';
import { ICity } from 'app/shared/model/city.model';
import { CityService } from 'app/entities/city';

@Component({
    selector: 'jhi-customer-update',
    templateUrl: './customer-update.component.html'
})
export class CustomerUpdateComponent implements OnInit {
    customer: ICustomer;
    isSaving: boolean;

    users: IUser[];

    countries: ICountry[];

    provinces: IProvince[];

    cities: ICity[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected customerService: CustomerService,
        protected userService: UserService,
        protected countryService: CountryService,
        protected provinceService: ProvinceService,
        protected cityService: CityService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ customer }) => {
            this.customer = customer;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.countryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICountry[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICountry[]>) => response.body)
            )
            .subscribe((res: ICountry[]) => (this.countries = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.provinceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProvince[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProvince[]>) => response.body)
            )
            .subscribe((res: IProvince[]) => (this.provinces = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.cityService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICity[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICity[]>) => response.body)
            )
            .subscribe((res: ICity[]) => (this.cities = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.customer.id !== undefined) {
            this.subscribeToSaveResponse(this.customerService.update(this.customer));
        } else {
            this.subscribeToSaveResponse(this.customerService.create(this.customer));
        }
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackCountryById(index: number, item: ICountry) {
        return item.id;
    }

    trackProvinceById(index: number, item: IProvince) {
        return item.id;
    }

    trackCityById(index: number, item: ICity) {
        return item.id;
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>) {
        result.subscribe((res: HttpResponse<ICustomer>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
