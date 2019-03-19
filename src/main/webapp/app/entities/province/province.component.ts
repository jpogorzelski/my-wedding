import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IProvince } from 'app/shared/model/province.model';
import { AccountService } from 'app/core';
import { ProvinceService } from './province.service';

@Component({
    selector: 'jhi-province',
    templateUrl: './province.component.html'
})
export class ProvinceComponent implements OnInit, OnDestroy {
    provinces: IProvince[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected provinceService: ProvinceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.provinceService
            .query()
            .pipe(
                filter((res: HttpResponse<IProvince[]>) => res.ok),
                map((res: HttpResponse<IProvince[]>) => res.body)
            )
            .subscribe(
                (res: IProvince[]) => {
                    this.provinces = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInProvinces();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProvince) {
        return item.id;
    }

    registerChangeInProvinces() {
        this.eventSubscriber = this.eventManager.subscribe('provinceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
