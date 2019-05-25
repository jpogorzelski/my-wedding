import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MyWeddingSharedModule } from 'app/shared';
import {
    CompanyComponent,
    CompanyDeleteDialogComponent,
    CompanyDeletePopupComponent,
    CompanyDetailComponent,
    CompanyOfferComponent,
    companyPopupRoute,
    companyRoute,
    CompanyUpdateComponent,
    CurrentCompanyUpdateComponent
} from './';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MyWeddingReservationOrderModule } from 'app/entities/reservation-order/reservation-order.module';
import { MyWeddingWeddingHallExtModule } from 'app/entities/ext/wedding-hall/wedding-hall.module';
import { MyWeddingOfferExtModule } from 'app/entities/ext/offer/offer.module';
import { CompanyWeddingHallComponent } from 'app/entities/ext/company/company-wedding-hall.component';

const ENTITY_STATES = [...companyRoute, ...companyPopupRoute];

@NgModule({
    imports: [
        MyWeddingSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        NgSelectModule,
        FormsModule,
        MyWeddingReservationOrderModule,
        MyWeddingWeddingHallExtModule,
        MyWeddingOfferExtModule
    ],
    declarations: [
        CompanyComponent,
        CompanyDetailComponent,
        CompanyUpdateComponent,
        CompanyDeleteDialogComponent,
        CompanyDeletePopupComponent,
        CurrentCompanyUpdateComponent,
        CompanyOfferComponent,
        CompanyWeddingHallComponent
    ],
    entryComponents: [
        CompanyComponent,
        CompanyUpdateComponent,
        CurrentCompanyUpdateComponent,
        CompanyDeleteDialogComponent,
        CompanyDeletePopupComponent,
        CompanyOfferComponent,
        CompanyWeddingHallComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingCompanyExtModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
