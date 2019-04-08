import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MyWeddingSharedModule } from 'app/shared';
import {
    ReservationOrderComponent,
    ReservationOrderDetailComponent,
    ReservationOrderUpdateComponent,
    ReservationOrderDeletePopupComponent,
    ReservationOrderDeleteDialogComponent,
    reservationOrderRoute,
    reservationOrderPopupRoute
} from './';

const ENTITY_STATES = [...reservationOrderRoute, ...reservationOrderPopupRoute];

@NgModule({
    imports: [MyWeddingSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ReservationOrderComponent,
        ReservationOrderDetailComponent,
        ReservationOrderUpdateComponent,
        ReservationOrderDeleteDialogComponent,
        ReservationOrderDeletePopupComponent
    ],
    entryComponents: [
        ReservationOrderComponent,
        ReservationOrderUpdateComponent,
        ReservationOrderDeleteDialogComponent,
        ReservationOrderDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingReservationOrderModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
