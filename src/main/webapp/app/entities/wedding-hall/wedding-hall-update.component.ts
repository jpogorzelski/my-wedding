import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from './wedding-hall.service';
import { IAlbum } from 'app/shared/model/album.model';
import { AlbumService } from 'app/entities/album';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';
import { IProvince } from 'app/shared/model/province.model';
import { ProvinceService } from 'app/entities/province';
import { ICity } from 'app/shared/model/city.model';
import { CityService } from 'app/entities/city';
import { ICompany } from 'app/shared/model/company.model';
import { CompanyService } from 'app/entities/company';

@Component({
    selector: 'jhi-wedding-hall-update',
    templateUrl: './wedding-hall-update.component.html'
})
export class WeddingHallUpdateComponent implements OnInit {
    weddingHall: IWeddingHall;
    isSaving: boolean;

    albums: IAlbum[];

    countries: ICountry[];

    provinces: IProvince[];

    cities: ICity[];

    companies: ICompany[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected weddingHallService: WeddingHallService,
        protected albumService: AlbumService,
        protected countryService: CountryService,
        protected provinceService: ProvinceService,
        protected cityService: CityService,
        protected companyService: CompanyService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ weddingHall }) => {
            this.weddingHall = weddingHall;
        });
        this.albumService
            .query({ filter: 'weddinghall-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IAlbum[]>) => mayBeOk.ok),
                map((response: HttpResponse<IAlbum[]>) => response.body)
            )
            .subscribe(
                (res: IAlbum[]) => {
                    if (!this.weddingHall.album || !this.weddingHall.album.id) {
                        this.albums = res;
                    } else {
                        this.albumService
                            .find(this.weddingHall.album.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IAlbum>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IAlbum>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IAlbum) => (this.albums = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
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

    trackAlbumById(index: number, item: IAlbum) {
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

    trackCompanyById(index: number, item: ICompany) {
        return item.id;
    }
}
