import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Company, ICompany } from 'app/shared/model/company.model';
import { CompanyService } from './company.service';
import { CompanyComponent } from './company.component';
import { CompanyDetailComponent } from './company-detail.component';
import { CompanyUpdateComponent } from './company-update.component';
import { CompanyDeletePopupComponent } from './company-delete-dialog.component';
import { CurrentCompanyUpdateComponent } from 'app/entities/ext/company/current-company-update.component';
import { CompanyOfferComponent } from 'app/entities/ext/company/company-offer.component';
import { CompanyWeddingHallComponent } from 'app/entities/ext/company/company-wedding-hall.component';
import { CompanyReservationOrderComponent } from 'app/entities/ext/company/company-reservation-order.component';

@Injectable({ providedIn: 'root' })
export class CompanyResolve implements Resolve<ICompany> {
    constructor(private service: CompanyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICompany> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Company>) => response.ok),
                map((company: HttpResponse<Company>) => company.body)
            );
        }
        return of(new Company());
    }
}

@Injectable({ providedIn: 'root' })
export class CurrentCompanyResolve implements Resolve<ICompany> {
    constructor(private service: CompanyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICompany> {
        return this.service.current().pipe(
            filter((response: HttpResponse<Company>) => response.ok),
            map((company: HttpResponse<Company>) => company.body)
        );
    }
}

export const companyRoute: Routes = [
    {
        path: '',
        component: CompanyComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'current/reservation-orders',
        component: CompanyReservationOrderComponent,
        data: {
            authorities: ['ROLE_COMPANY_OWNER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'current/offers',
        component: CompanyOfferComponent,
        data: {
            authorities: ['ROLE_COMPANY_OWNER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'current/wedding-halls',
        component: CompanyWeddingHallComponent,
        data: {
            authorities: ['ROLE_COMPANY_OWNER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: CompanyDetailComponent,
        resolve: {
            company: CompanyResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: CompanyUpdateComponent,
        resolve: {
            company: CompanyResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: CompanyUpdateComponent,
        resolve: {
            company: CompanyResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'profile',
        component: CurrentCompanyUpdateComponent,
        resolve: {
            company: CurrentCompanyResolve
        },
        data: {
            authorities: ['ROLE_COMPANY_OWNER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const companyPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: CompanyDeletePopupComponent,
        resolve: {
            company: CompanyResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.company.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
