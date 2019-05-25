import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { AccountService } from 'app/core';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { CompanyService } from 'app/entities/ext/company/company.service';
import { WeddingHallComponent, WeddingHallService } from 'app/entities/ext/wedding-hall';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-company-wedding-hall',
    templateUrl: '../wedding-hall/wedding-hall.component.html'
})
export class CompanyWeddingHallComponent extends WeddingHallComponent implements OnInit, OnDestroy {
    constructor(
        protected weddingHallService: WeddingHallService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected companyService: CompanyService
    ) {
        super(weddingHallService, jhiAlertService, eventManager, activatedRoute, accountService);
    }

    loadHalls() {
        this.companyService
            .currentWeddingHalls()
            .pipe(
                filter((res: HttpResponse<IWeddingHall[]>) => res.ok),
                map((res: HttpResponse<IWeddingHall[]>) => res.body)
            )
            .subscribe(
                (res: IWeddingHall[]) => {
                    this.weddingHalls = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }
}
