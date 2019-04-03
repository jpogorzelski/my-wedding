import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MyWeddingSharedModule } from 'app/shared';
import {
    WeddingHallComponent,
    WeddingHallDeleteDialogComponent,
    WeddingHallDeletePopupComponent,
    WeddingHallDetailComponent,
    weddingHallPopupRoute,
    weddingHallRoute,
    WeddingHallUpdateComponent
} from './';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

const ENTITY_STATES = [...weddingHallRoute, ...weddingHallPopupRoute];

@NgModule({
    imports: [MyWeddingSharedModule, RouterModule.forChild(ENTITY_STATES), NgSelectModule, FormsModule],
    declarations: [
        WeddingHallComponent,
        WeddingHallDetailComponent,
        WeddingHallUpdateComponent,
        WeddingHallDeleteDialogComponent,
        WeddingHallDeletePopupComponent
    ],
    entryComponents: [WeddingHallComponent, WeddingHallUpdateComponent, WeddingHallDeleteDialogComponent, WeddingHallDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingWeddingHallModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
