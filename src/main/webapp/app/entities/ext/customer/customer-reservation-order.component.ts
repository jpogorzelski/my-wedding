import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { AccountService } from 'app/core';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { ActivatedRoute } from '@angular/router';
import { ReservationOrderComponent, ReservationOrderService } from 'app/entities/ext/reservation-order';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { CustomerService } from 'app/entities/ext/customer/customer.service';

@Component({
    selector: 'jhi-customer-reservation-order',
    templateUrl: '../reservation-order/reservation-order.component.html'
})
export class CustomerReservationOrderComponent extends ReservationOrderComponent implements OnInit, OnDestroy {
    constructor(
        protected reservationOrderService: ReservationOrderService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected customerService: CustomerService
    ) {
        super(reservationOrderService, jhiAlertService, eventManager, accountService, activatedRoute);
    }

    loadOrders() {
        this.customerService
            .currentReservationOrders()
            .pipe(
                filter((res: HttpResponse<IReservationOrder[]>) => res.ok),
                map((res: HttpResponse<IReservationOrder[]>) => res.body)
            )
            .subscribe(
                (res: IReservationOrder[]) => {
                    this.reservationOrders = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }
}
