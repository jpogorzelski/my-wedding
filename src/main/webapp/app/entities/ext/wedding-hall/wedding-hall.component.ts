import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { AccountService } from 'app/core';
import { WeddingHallService } from './wedding-hall.service';

@Component({
    selector: 'jhi-wedding-hall',
    templateUrl: './wedding-hall.component.html'
})
export class WeddingHallComponent implements OnInit, OnDestroy {
    weddingHalls: IWeddingHall[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected weddingHallService: WeddingHallService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.weddingHallService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IWeddingHall[]>) => res.ok),
                    map((res: HttpResponse<IWeddingHall[]>) => res.body)
                )
                .subscribe((res: IWeddingHall[]) => (this.weddingHalls = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.weddingHallService
            .query()
            .pipe(
                filter((res: HttpResponse<IWeddingHall[]>) => res.ok),
                map((res: HttpResponse<IWeddingHall[]>) => res.body)
            )
            .subscribe(
                (res: IWeddingHall[]) => {
                    this.weddingHalls = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInWeddingHalls();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IWeddingHall) {
        return item.id;
    }

    registerChangeInWeddingHalls() {
        this.eventSubscriber = this.eventManager.subscribe('weddingHallListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
