import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from './offer.service';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from 'app/entities/wedding-hall';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { ReservationOrderService } from 'app/entities/ext/reservation-order';

@Component({
    selector: 'jhi-offer-update',
    templateUrl: './offer-update.component.html'
})
export class OfferUpdateComponent implements OnInit {
    offer: IOffer;
    isSaving: boolean;

    weddinghalls: IWeddingHall[];

    reservationorders: IReservationOrder[];
    eventDate: string;
    startDateDp: any;
    endDateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected offerService: OfferService,
        protected weddingHallService: WeddingHallService,
        protected reservationOrderService: ReservationOrderService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ offer }) => {
            this.offer = offer;
            this.eventDate = this.offer.eventDate != null ? this.offer.eventDate.format(DATE_TIME_FORMAT) : null;
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
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.offer.eventDate = this.eventDate != null ? moment(this.eventDate, DATE_TIME_FORMAT) : null;
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
}
