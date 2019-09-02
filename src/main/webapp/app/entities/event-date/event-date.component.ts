import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEventDate } from 'app/shared/model/event-date.model';
import { AccountService } from 'app/core';
import { EventDateService } from './event-date.service';

@Component({
    selector: 'jhi-event-date',
    templateUrl: './event-date.component.html'
})
export class EventDateComponent implements OnInit, OnDestroy {
    eventDates: IEventDate[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected eventDateService: EventDateService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.eventDateService
            .query()
            .pipe(
                filter((res: HttpResponse<IEventDate[]>) => res.ok),
                map((res: HttpResponse<IEventDate[]>) => res.body)
            )
            .subscribe(
                (res: IEventDate[]) => {
                    this.eventDates = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInEventDates();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IEventDate) {
        return item.id;
    }

    registerChangeInEventDates() {
        this.eventSubscriber = this.eventManager.subscribe('eventDateListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
