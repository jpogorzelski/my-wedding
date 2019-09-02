import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventDate } from 'app/shared/model/event-date.model';
import { EventDateService } from './event-date.service';
import { EventDateComponent } from './event-date.component';
import { EventDateDetailComponent } from './event-date-detail.component';
import { EventDateUpdateComponent } from './event-date-update.component';
import { EventDateDeletePopupComponent } from './event-date-delete-dialog.component';
import { IEventDate } from 'app/shared/model/event-date.model';

@Injectable({ providedIn: 'root' })
export class EventDateResolve implements Resolve<IEventDate> {
    constructor(private service: EventDateService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEventDate> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<EventDate>) => response.ok),
                map((eventDate: HttpResponse<EventDate>) => eventDate.body)
            );
        }
        return of(new EventDate());
    }
}

export const eventDateRoute: Routes = [
    {
        path: '',
        component: EventDateComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.eventDate.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: EventDateDetailComponent,
        resolve: {
            eventDate: EventDateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.eventDate.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: EventDateUpdateComponent,
        resolve: {
            eventDate: EventDateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.eventDate.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: EventDateUpdateComponent,
        resolve: {
            eventDate: EventDateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.eventDate.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventDatePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: EventDateDeletePopupComponent,
        resolve: {
            eventDate: EventDateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'myWeddingApp.eventDate.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
