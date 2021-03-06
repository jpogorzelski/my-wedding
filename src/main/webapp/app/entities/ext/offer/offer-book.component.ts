import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { IOffer } from 'app/shared/model/offer.model';
import { ReservationOrderService } from 'app/entities/ext/reservation-order';
import { CustomerService } from 'app/entities/ext/customer';

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
        protected customerService: CustomerService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ reservationOrder }) => {
            this.offer = reservationOrder.offer;
            this.reservationOrder = reservationOrder;
            this.customerService.current().subscribe(customer => {
                this.reservationOrder.customer = customer.body;
            });
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.reservationOrder.id) {
            console.log('#### update: ' + this.reservationOrder.id);
            this.subscribeToSaveResponse(this.reservationOrderService.update(this.reservationOrder));
        } else {
            console.log('#### create');
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
