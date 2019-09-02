import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from './offer.service';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from 'app/entities/wedding-hall';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { ReservationOrderService } from 'app/entities/reservation-order';
import { IAlbum } from 'app/shared/model/album.model';
import { AlbumService } from 'app/entities/album';
import { IPhoto } from 'app/shared/model/photo.model';
import { PhotoService } from 'app/entities/photo';

@Component({
    selector: 'jhi-offer-update',
    templateUrl: './offer-update.component.html'
})
export class OfferUpdateComponent implements OnInit {
    offer: IOffer;
    isSaving: boolean;

    weddinghalls: IWeddingHall[];

    reservationorders: IReservationOrder[];

    albums: IAlbum[];

    photos: IPhoto[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected offerService: OfferService,
        protected weddingHallService: WeddingHallService,
        protected reservationOrderService: ReservationOrderService,
        protected albumService: AlbumService,
        protected photoService: PhotoService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ offer }) => {
            this.offer = offer;
        });
        this.weddingHallService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IWeddingHall[]>) => mayBeOk.ok),
                map((response: HttpResponse<IWeddingHall[]>) => response.body)
            )
            .subscribe((res: IWeddingHall[]) => (this.weddinghalls = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.reservationOrderService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IReservationOrder[]>) => mayBeOk.ok),
                map((response: HttpResponse<IReservationOrder[]>) => response.body)
            )
            .subscribe((res: IReservationOrder[]) => (this.reservationorders = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.albumService
            .query({ filter: 'offer-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IAlbum[]>) => mayBeOk.ok),
                map((response: HttpResponse<IAlbum[]>) => response.body)
            )
            .subscribe(
                (res: IAlbum[]) => {
                    if (!this.offer.album || !this.offer.album.id) {
                        this.albums = res;
                    } else {
                        this.albumService
                            .find(this.offer.album.id)
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
        this.photoService
            .query({ filter: 'offer-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IPhoto[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPhoto[]>) => response.body)
            )
            .subscribe(
                (res: IPhoto[]) => {
                    if (!this.offer.photo || !this.offer.photo.id) {
                        this.photos = res;
                    } else {
                        this.photoService
                            .find(this.offer.photo.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IPhoto>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IPhoto>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IPhoto) => (this.photos = [subRes].concat(res)),
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
        if (this.offer.id !== undefined) {
            this.subscribeToSaveResponse(this.offerService.update(this.offer));
        } else {
            this.subscribeToSaveResponse(this.offerService.create(this.offer));
        }
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

    trackWeddingHallById(index: number, item: IWeddingHall) {
        return item.id;
    }

    trackReservationOrderById(index: number, item: IReservationOrder) {
        return item.id;
    }

    trackAlbumById(index: number, item: IAlbum) {
        return item.id;
    }

    trackPhotoById(index: number, item: IPhoto) {
        return item.id;
    }
}
