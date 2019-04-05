import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ICompany } from 'app/shared/model/company.model';
import { AccountService } from 'app/core';
import { CompanyService } from './company.service';

@Component({
    selector: 'jhi-company',
    templateUrl: './company.component.html'
})
export class CompanyComponent implements OnInit, OnDestroy {
    companies: ICompany[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected companyService: CompanyService,
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
            this.companyService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<ICompany[]>) => res.ok),
                    map((res: HttpResponse<ICompany[]>) => res.body)
                )
                .subscribe((res: ICompany[]) => (this.companies = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.companyService
            .query()
            .pipe(
                filter((res: HttpResponse<ICompany[]>) => res.ok),
                map((res: HttpResponse<ICompany[]>) => res.body)
            )
            .subscribe(
                (res: ICompany[]) => {
                    this.companies = res;
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
        this.registerChangeInCompanies();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICompany) {
        return item.id;
    }

    registerChangeInCompanies() {
        this.eventSubscriber = this.eventManager.subscribe('companyListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
