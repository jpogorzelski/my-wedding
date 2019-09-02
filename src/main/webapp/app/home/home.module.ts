import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyWeddingSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { MyWeddingWeddingHallExtModule } from 'app/entities/ext/wedding-hall/wedding-hall.module';

@NgModule({
    imports: [MyWeddingSharedModule, RouterModule.forChild([HOME_ROUTE]), MyWeddingWeddingHallExtModule],
    declarations: [HomeComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingHomeModule {}
