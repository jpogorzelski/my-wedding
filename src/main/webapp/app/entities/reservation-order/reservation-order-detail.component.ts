import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReservationOrder } from 'app/shared/model/reservation-order.model';

@Component({
    selector: 'jhi-reservation-order-detail',
    templateUrl: './reservation-order-detail.component.html'
})
export class ReservationOrderDetailComponent implements OnInit {
    reservationOrder: IReservationOrder;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ reservationOrder }) => {
            this.reservationOrder = reservationOrder;
        });
    }

    previousState() {
        window.history.back();
    }
}
