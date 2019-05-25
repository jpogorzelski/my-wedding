import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferComponent, OfferService } from 'app/entities/ext/offer';
import { IOffer } from 'app/shared/model/offer.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { AccountService } from 'app/core';
import { CustomerService } from 'app/entities/ext/customer';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { CompanyService } from 'app/entities/ext/company/company.service';

@Component({
    selector: 'jhi-company-offer',
    templateUrl: '../offer/offer.component.html'
})
export class CompanyOfferComponent extends OfferComponent implements OnInit, OnDestroy {
    constructor(
        protected offerService: OfferService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected customerService: CustomerService,
        protected companyService: CompanyService
    ) {
        super(offerService, jhiAlertService, eventManager, accountService, customerService);
    }

    loadOffers() {
        this.companyService
            .currentOffers()
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
}
