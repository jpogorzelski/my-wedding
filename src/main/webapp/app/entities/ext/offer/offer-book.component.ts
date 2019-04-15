import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { ReservationOrderService } from 'app/entities/reservation-order';

@Component({
    selector: 'jhi-offer-book',
    templateUrl: './offer-book.component.html'
})
export class OfferBookComponent implements OnInit {
    reservationOrder: IReservationOrder;
    isSaving: boolean;

    constructor(
        protected reservationOrderService: ReservationOrderService,
        protected activatedRoute: ActivatedRoute,
        protected jhiAlertService: JhiAlertService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ reservationOrder }) => {
            this.reservationOrder = reservationOrder;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.reservationOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.reservationOrderService.update(this.reservationOrder));
        } else {
            this.subscribeToSaveResponse(this.reservationOrderService.create(this.reservationOrder));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservationOrder>>) {
        result.subscribe((res: HttpResponse<IReservationOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
