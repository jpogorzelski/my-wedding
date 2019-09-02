import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from './wedding-hall.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';
import { IProvince } from 'app/shared/model/province.model';
import { ProvinceService } from 'app/entities/province';
import { ICity } from 'app/shared/model/city.model';
import { CityService } from 'app/entities/city';
import { ICompany } from 'app/shared/model/company.model';
import { CompanyService } from 'app/entities/company';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from 'app/entities/offer';

@Component({
    selector: 'jhi-wedding-hall-update',
    templateUrl: './wedding-hall-update.component.html'
})
export class WeddingHallUpdateComponent implements OnInit {
    weddingHall: IWeddingHall;
    isSaving: boolean;

    countries: ICountry[];

    provinces: IProvince[];

    cities: ICity[];

    companies: ICompany[];

    offers: IOffer[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected weddingHallService: WeddingHallService,
        protected countryService: CountryService,
        protected provinceService: ProvinceService,
        protected cityService: CityService,
        protected companyService: CompanyService,
        protected offerService: OfferService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ weddingHall }) => {
            this.weddingHall = weddingHall;
        });
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
        this.companyService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICompany[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICompany[]>) => response.body)
            )
            .subscribe((res: ICompany[]) => (this.companies = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.offerService
            .query({ filter: 'weddinghall-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IOffer[]>) => mayBeOk.ok),
                map((response: HttpResponse<IOffer[]>) => response.body)
            )
            .subscribe(
                (res: IOffer[]) => {
                    if (!this.weddingHall.offer || !this.weddingHall.offer.id) {
                        this.offers = res;
                    } else {
                        this.offerService
                            .find(this.weddingHall.offer.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IOffer>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IOffer>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IOffer) => (this.offers = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.weddingHall.id !== undefined) {
            this.subscribeToSaveResponse(this.weddingHallService.update(this.weddingHall));
        } else {
            this.subscribeToSaveResponse(this.weddingHallService.create(this.weddingHall));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeddingHall>>) {
        result.subscribe((res: HttpResponse<IWeddingHall>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCountryById(index: number, item: ICountry) {
        return item.id;
    }

    trackProvinceById(index: number, item: IProvince) {
        return item.id;
    }

    trackCityById(index: number, item: ICity) {
        return item.id;
    }

    trackCompanyById(index: number, item: ICompany) {
        return item.id;
    }

    trackOfferById(index: number, item: IOffer) {
        return item.id;
    }
}
