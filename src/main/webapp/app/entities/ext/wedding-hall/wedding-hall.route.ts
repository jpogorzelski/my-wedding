import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IWeddingHall, WeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from './wedding-hall.service';
import { WeddingHallComponent } from './wedding-hall.component';
import { WeddingHallDetailComponent } from './wedding-hall-detail.component';
import { WeddingHallUpdateComponent } from './wedding-hall-update.component';
import { WeddingHallDeletePopupComponent } from './wedding-hall-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class WeddingHallResolve implements Resolve<IWeddingHall> {
    constructor(private service: WeddingHallService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWeddingHall> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<WeddingHall>) => response.ok),
                map((weddingHall: HttpResponse<WeddingHall>) => weddingHall.body)
            );
        }
        return of(new WeddingHall());
    }
}

export const weddingHallRoute: Routes = [
    {
        path: '',
        component: WeddingHallComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.weddingHall.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: WeddingHallDetailComponent,
        resolve: {
            weddingHall: WeddingHallResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.weddingHall.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: WeddingHallUpdateComponent,
        resolve: {
            weddingHall: WeddingHallResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.weddingHall.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: WeddingHallUpdateComponent,
        resolve: {
            weddingHall: WeddingHallResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.weddingHall.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const weddingHallPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: WeddingHallDeletePopupComponent,
        resolve: {
            weddingHall: WeddingHallResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.weddingHall.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
