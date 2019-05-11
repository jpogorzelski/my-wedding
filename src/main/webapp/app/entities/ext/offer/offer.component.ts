import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IOffer } from 'app/shared/model/offer.model';
import { AccountService } from 'app/core';
import { OfferService } from './offer.service';
import { CustomerService } from 'app/entities/ext/customer';

@Component({
    selector: 'jhi-offer',
    templateUrl: './offer.component.html'
})
export class OfferComponent implements OnInit, OnDestroy {
    offers: IOffer[];
    currentAccount: any;
    eventSubscriber: Subscription;
    isCustomer = false;

    constructor(
        protected offerService: OfferService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected customerService: CustomerService
    ) {}

    loadAll() {
        this.offerService
            .query()
            .pipe(
                filter((res: HttpResponse<IOffer[]>) => res.ok),
                map((res: HttpResponse<IOffer[]>) => res.body)
            )
            .subscribe(
                (res: IOffer[]) => {
                    this.offers = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.customerService.current().subscribe(customer => {
            this.isCustomer = customer.body != null;
        });
        this.registerChangeInOffers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOffer) {
        return item.id;
    }

    registerChangeInOffers() {
        this.eventSubscriber = this.eventManager.subscribe('offerListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
