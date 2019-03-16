import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Province } from 'app/shared/model/province.model';
import { ProvinceService } from './province.service';
import { ProvinceComponent } from './province.component';
import { ProvinceDetailComponent } from './province-detail.component';
import { ProvinceUpdateComponent } from './province-update.component';
import { ProvinceDeletePopupComponent } from './province-delete-dialog.component';
import { IProvince } from 'app/shared/model/province.model';

@Injectable({ providedIn: 'root' })
export class ProvinceResolve implements Resolve<IProvince> {
    constructor(private service: ProvinceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProvince> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Province>) => response.ok),
                map((province: HttpResponse<Province>) => province.body)
            );
        }
        return of(new Province());
    }
}

export const provinceRoute: Routes = [
    {
        path: '',
        component: ProvinceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.province.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProvinceDetailComponent,
        resolve: {
            province: ProvinceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.province.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProvinceUpdateComponent,
        resolve: {
            province: ProvinceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.province.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProvinceUpdateComponent,
        resolve: {
            province: ProvinceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.province.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const provincePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProvinceDeletePopupComponent,
        resolve: {
            province: ProvinceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.province.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
