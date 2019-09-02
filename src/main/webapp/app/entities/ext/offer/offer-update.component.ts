import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from './offer.service';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from 'app/entities/wedding-hall';
import { IPhoto } from 'app/shared/model/photo.model';

@Component({
    selector: 'jhi-offer-update',
    templateUrl: './offer-update.component.html'
})
export class OfferUpdateComponent implements OnInit {
    offer: IOffer;
    isSaving: boolean;

    weddinghalls: IWeddingHall[];
    eventDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected offerService: OfferService,
        protected weddingHallService: WeddingHallService,
        protected activatedRoute: ActivatedRoute,
        protected dataUtils: JhiDataUtils,
        protected elementRef: ElementRef
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ offer }) => {
            this.offer = offer;
            this.offer.album = this.offer.album || { title: '' };
            this.offer.album.photos = this.offer.album.photos || [];
        });
        this.weddingHallService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IWeddingHall[]>) => mayBeOk.ok),
                map((response: HttpResponse<IWeddingHall[]>) => response.body)
            )
            .subscribe((res: IWeddingHall[]) => (this.weddinghalls = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.offer.id !== undefined) {
            this.subscribeToSaveResponse(this.offerService.update(this.offer));
        } else {
            this.subscribeToSaveResponse(this.offerService.create(this.offer));
        }
    }

    trackWeddingHallById(index: number, item: IWeddingHall) {
        return item.id;
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
        console.log('adding new image.');
        this.offer.album.photos.push({ album: { id: this.offer.album.id } });
    }

    deleteImage(photo: IPhoto) {
        console.log('removing photo: ' + photo);
        this.offer.album.photos.splice(this.offer.album.photos.indexOf(photo), 1);
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffer>>) {
        result.subscribe((res: HttpResponse<IOffer>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
