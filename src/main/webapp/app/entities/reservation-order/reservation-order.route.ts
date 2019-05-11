import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ReservationOrder } from 'app/shared/model/reservation-order.model';
import { ReservationOrderService } from './reservation-order.service';
import { ReservationOrderComponent } from './reservation-order.component';
import { ReservationOrderDetailComponent } from './reservation-order-detail.component';
import { ReservationOrderUpdateComponent } from './reservation-order-update.component';
import { ReservationOrderDeletePopupComponent } from './reservation-order-delete-dialog.component';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';

@Injectable({ providedIn: 'root' })
export class ReservationOrderResolve implements Resolve<IReservationOrder> {
    constructor(private service: ReservationOrderService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IReservationOrder> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ReservationOrder>) => response.ok),
                map((reservationOrder: HttpResponse<ReservationOrder>) => reservationOrder.body)
            );
        }
        return of(new ReservationOrder());
    }
}

export const reservationOrderRoute: Routes = [
    {
        path: '',
        component: ReservationOrderComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.reservationOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ReservationOrderDetailComponent,
        resolve: {
            reservationOrder: ReservationOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.reservationOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ReservationOrderUpdateComponent,
        resolve: {
            reservationOrder: ReservationOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.reservationOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ReservationOrderUpdateComponent,
        resolve: {
            reservationOrder: ReservationOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.reservationOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const reservationOrderPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ReservationOrderDeletePopupComponent,
        resolve: {
            reservationOrder: ReservationOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.reservationOrder.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
