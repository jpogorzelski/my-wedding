import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { ReservationOrderService } from './reservation-order.service';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from 'app/entities/offer';
import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from 'app/entities/customer';

@Component({
    selector: 'jhi-reservation-order-update',
    templateUrl: './reservation-order-update.component.html'
})
export class ReservationOrderUpdateComponent implements OnInit {
    reservationOrder: IReservationOrder;
    isSaving: boolean;

    eventdates: IOffer[];

    customers: ICustomer[];
    createDateDp: any;
    modificationDateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected reservationOrderService: ReservationOrderService,
        protected offerService: OfferService,
        protected customerService: CustomerService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ reservationOrder }) => {
            this.reservationOrder = reservationOrder;
        });
        this.offerService
            .query({ filter: 'reservationorder-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IOffer[]>) => mayBeOk.ok),
                map((response: HttpResponse<IOffer[]>) => response.body)
            )
            .subscribe(
                (res: IOffer[]) => {
                    if (!this.reservationOrder.eventDate || !this.reservationOrder.eventDate.id) {
                        this.eventdates = res;
                    } else {
                        this.offerService
                            .find(this.reservationOrder.eventDate.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IOffer>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IOffer>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IOffer) => (this.eventdates = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.customerService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICustomer[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICustomer[]>) => response.body)
            )
            .subscribe((res: ICustomer[]) => (this.customers = res), (res: HttpErrorResponse) => this.onError(res.message));
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

    trackOfferById(index: number, item: IOffer) {
        return item.id;
    }

    trackCustomerById(index: number, item: ICustomer) {
        return item.id;
    }
}
