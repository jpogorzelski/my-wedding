import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MyWeddingSharedModule } from 'app/shared';
import {
    CurrentCustomerUpdateComponent,
    CustomerComponent,
    CustomerDeleteDialogComponent,
    CustomerDeletePopupComponent,
    CustomerDetailComponent,
    customerPopupRoute,
    CustomerReservationOrderComponent,
    customerRoute,
    CustomerUpdateComponent
} from './';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FavoritesComponent } from './favorites/favorites.component';

const ENTITY_STATES = [...customerRoute, ...customerPopupRoute];

@NgModule({
    imports: [MyWeddingSharedModule, RouterModule.forChild(ENTITY_STATES), NgSelectModule, FormsModule],
    declarations: [
        CustomerComponent,
        CustomerDetailComponent,
        CustomerUpdateComponent,
        CurrentCustomerUpdateComponent,
        CustomerDeleteDialogComponent,
        CustomerDeletePopupComponent,
        FavoritesComponent,
        CustomerReservationOrderComponent
    ],
    entryComponents: [
        CustomerComponent,
        CustomerUpdateComponent,
        CurrentCustomerUpdateComponent,
        CustomerDeleteDialogComponent,
        CustomerDeletePopupComponent,
        CustomerReservationOrderComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingCustomerExtModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
