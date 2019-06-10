import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from './wedding-hall.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';
import { IProvince } from 'app/shared/model/province.model';
import { ProvinceService } from 'app/entities/province';
import { ICity } from 'app/shared/model/city.model';
import { CityService } from 'app/entities/city';
import { CompanyService } from 'app/entities/ext/company';
import { IPhoto } from 'app/shared/model/photo.model';

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

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected weddingHallService: WeddingHallService,
        protected countryService: CountryService,
        protected provinceService: ProvinceService,
        protected cityService: CityService,
        protected companyService: CompanyService,
        protected activatedRoute: ActivatedRoute,
        protected dataUtils: JhiDataUtils,
        protected elementRef: ElementRef
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ weddingHall }) => {
            this.weddingHall = weddingHall;
            this.weddingHall.albums = this.weddingHall.albums || [];
            if (this.weddingHall.albums.length === 0) {
                this.weddingHall.albums[0] = {};
            }
            this.weddingHall.albums[0].photos = this.weddingHall.albums[0].photos || [];
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

    trackCountryById(index: number, item: ICountry) {
        return item.id;
    }

    trackProvinceById(index: number, item: IProvince) {
        return item.id;
    }

    trackCityById(index: number, item: ICity) {
        return item.id;
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

    // photo related
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(photo: IPhoto, field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(photo, this.elementRef, field, fieldContentType, idInput);
    }

    newImage() {
        const idx = this.weddingHall.albums[0].photos.length;
        console.log('new image clicked. creating photo no. ' + idx);
        this.weddingHall.albums[0].photos[idx] = {};
    }
}
