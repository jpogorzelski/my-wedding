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
    CompanyReservationOrderComponent,
    companyRoute,
    CompanyUpdateComponent,
    CompanyWeddingHallComponent,
    CurrentCompanyUpdateComponent
} from './';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

const ENTITY_STATES = [...companyRoute, ...companyPopupRoute];

@NgModule({
    imports: [MyWeddingSharedModule, RouterModule.forChild(ENTITY_STATES), NgSelectModule, FormsModule],
    declarations: [
        CompanyComponent,
        CompanyDetailComponent,
        CompanyUpdateComponent,
        CompanyDeleteDialogComponent,
        CompanyDeletePopupComponent,
        CurrentCompanyUpdateComponent,
        CompanyOfferComponent,
        CompanyWeddingHallComponent,
        CompanyReservationOrderComponent
    ],
    entryComponents: [
        CompanyComponent,
        CompanyUpdateComponent,
        CurrentCompanyUpdateComponent,
        CompanyDeleteDialogComponent,
        CompanyDeletePopupComponent,
        CompanyOfferComponent,
        CompanyWeddingHallComponent,
        CompanyReservationOrderComponent
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
