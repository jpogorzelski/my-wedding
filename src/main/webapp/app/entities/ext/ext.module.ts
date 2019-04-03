import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'customer',
                loadChildren: './customer/customer.module#MyWeddingCustomerModule'
            },
            {
                path: 'company',
                loadChildren: './company/company.module#MyWeddingCompanyModule'
            },
            {
                path: 'wedding-hall',
                loadChildren: './wedding-hall/wedding-hall.module#MyWeddingWeddingHallModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingExtModule {}
