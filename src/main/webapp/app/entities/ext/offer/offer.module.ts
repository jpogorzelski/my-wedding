import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MyWeddingSharedModule } from 'app/shared';
import {
    OfferComponent,
    OfferDetailComponent,
    OfferUpdateComponent,
    OfferDeletePopupComponent,
    OfferDeleteDialogComponent,
    OfferBookPopupComponent,
    OfferBookDialogComponent,
    offerRoute,
    offerPopupRoute
} from './';

const ENTITY_STATES = [...offerRoute, ...offerPopupRoute];

@NgModule({
    imports: [MyWeddingSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        OfferComponent,
        OfferDetailComponent,
        OfferUpdateComponent,
        OfferDeleteDialogComponent,
        OfferDeletePopupComponent,
        OfferBookPopupComponent,
        OfferBookDialogComponent
    ],
    entryComponents: [
        OfferComponent,
        OfferUpdateComponent,
        OfferDeleteDialogComponent,
        OfferDeletePopupComponent,
        OfferBookPopupComponent,
        OfferBookDialogComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingOfferExtModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
