import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { AccountService } from 'app/core';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { CompanyService } from 'app/entities/ext/company/company.service';
import { ActivatedRoute } from '@angular/router';
import { ReservationOrderComponent, ReservationOrderService } from 'app/entities/ext/reservation-order';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';

@Component({
    selector: 'jhi-reservation-order-hall',
    templateUrl: '../reservation-order/reservation-order.component.html'
})
export class CompanyReservationOrderComponent extends ReservationOrderComponent implements OnInit, OnDestroy {
    constructor(
        protected reservationOrderService: ReservationOrderService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected companyService: CompanyService
    ) {
        super(reservationOrderService, jhiAlertService, eventManager, accountService, activatedRoute);
    }

    loadOrders() {
        this.companyService
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
