import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MyWeddingSharedModule } from 'app/shared';
import {
    EventDateComponent,
    EventDateDetailComponent,
    EventDateUpdateComponent,
    EventDateDeletePopupComponent,
    EventDateDeleteDialogComponent,
    eventDateRoute,
    eventDatePopupRoute
} from './';

const ENTITY_STATES = [...eventDateRoute, ...eventDatePopupRoute];

@NgModule({
    imports: [MyWeddingSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EventDateComponent,
        EventDateDetailComponent,
        EventDateUpdateComponent,
        EventDateDeleteDialogComponent,
        EventDateDeletePopupComponent
    ],
    entryComponents: [EventDateComponent, EventDateUpdateComponent, EventDateDeleteDialogComponent, EventDateDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingEventDateModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
