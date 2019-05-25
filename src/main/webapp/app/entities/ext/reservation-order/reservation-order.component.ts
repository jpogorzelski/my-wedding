import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { AccountService } from 'app/core';
import { ReservationOrderService } from './reservation-order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-reservation-order',
    templateUrl: './reservation-order.component.html'
})
export class ReservationOrderComponent implements OnInit, OnDestroy {
    reservationOrders: IReservationOrder[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected reservationOrderService: ReservationOrderService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute
    ) {}

    loadAll() {
        this.activatedRoute.data.subscribe(({ reservationOrders }) => {
            this.reservationOrders = reservationOrders;
        });
        this.loadOrders();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInReservationOrders();
    }

    loadOrders() {
        this.reservationOrderService
            .query()
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

    ngOnInit() {
        this.loadAll();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IReservationOrder) {
        return item.id;
    }

    registerChangeInReservationOrders() {
        this.eventSubscriber = this.eventManager.subscribe('reservationOrderListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
