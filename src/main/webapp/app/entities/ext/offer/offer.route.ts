import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IOffer, Offer } from 'app/shared/model/offer.model';
import { OfferService } from './offer.service';
import { OfferComponent } from './offer.component';
import { OfferDetailComponent } from './offer-detail.component';
import { OfferUpdateComponent } from './offer-update.component';
import { OfferDeletePopupComponent } from './offer-delete-dialog.component';
import { OfferBookComponent } from 'app/entities/ext/offer/offer-book.component';
import { IReservationOrder, ReservationOrder } from 'app/shared/model/reservation-order.model';
import { ReservationOrderService } from 'app/entities/ext/reservation-order';

@Injectable({ providedIn: 'root' })
export class OfferResolve implements Resolve<IOffer> {
    constructor(private service: OfferService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOffer> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Offer>) => response.ok),
                map((offer: HttpResponse<Offer>) => offer.body)
            );
        }
        return of(new Offer());
    }
}

@Injectable({ providedIn: 'root' })
export class OfferBookResolve implements Resolve<IReservationOrder> {
    constructor(private service: ReservationOrderService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IReservationOrder> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.findByOffer(id).pipe(
                filter((response: HttpResponse<ReservationOrder>) => response.ok),
                map((reservationOrder: HttpResponse<ReservationOrder>) => reservationOrder.body)
            );
        }
        return of(new ReservationOrder());
    }
}

export const offerRoute: Routes = [
    {
        path: '',
        component: OfferComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.offer.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: OfferDetailComponent,
        resolve: {
            offer: OfferResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.offer.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/book',
        component: OfferBookComponent,
        resolve: {
            reservationOrder: OfferBookResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.offer.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: OfferUpdateComponent,
        resolve: {
            offer: OfferResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.offer.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: OfferUpdateComponent,
        resolve: {
            offer: OfferResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.offer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const offerPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: OfferDeletePopupComponent,
        resolve: {
            offer: OfferResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.offer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
