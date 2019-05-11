import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { AccountService } from 'app/core';
import { ReservationOrderService } from './reservation-order.service';

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
        protected accountService: AccountService
    ) {}

    loadAll() {
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
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInReservationOrders();
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
