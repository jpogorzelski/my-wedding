import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { IOffer } from 'app/shared/model/offer.model';
import { ICustomer } from 'app/shared/model/customer.model';
import { ReservationOrderService } from 'app/entities/reservation-order';

@Component({
    selector: 'jhi-offer-book',
    templateUrl: './offer-book.component.html'
})
export class OfferBookComponent implements OnInit {
    offer: IOffer;
    reservationOrder: IReservationOrder;
    isSaving: boolean;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected reservationOrderService: ReservationOrderService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ offer }) => {
            this.offer = offer;
            this.reservationOrder = offer.reservationOrder;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        console.log('#### SAVE START');
        this.isSaving = true;
        if (this.reservationOrder.id !== undefined) {
            console.log('#### SAVE UPDATE');
            this.subscribeToSaveResponse(this.reservationOrderService.update(this.reservationOrder));
        } else {
            console.log('#### SAVE CREATE');
            this.subscribeToSaveResponse(this.reservationOrderService.create(this.reservationOrder));
        }
        console.log('#### SAVE END');
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
