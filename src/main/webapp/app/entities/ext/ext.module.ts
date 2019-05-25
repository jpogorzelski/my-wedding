import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'customer',
                loadChildren: './customer/customer.module#MyWeddingCustomerExtModule'
            },
            {
                path: 'company',
                loadChildren: './company/company.module#MyWeddingCompanyExtModule'
            },
            {
                path: 'wedding-hall',
                loadChildren: './wedding-hall/wedding-hall.module#MyWeddingWeddingHallExtModule'
            },
            {
                path: 'reservation-order',
                loadChildren: './reservation-order/reservation-order.module#MyWeddingReservationOrderExtModule'
            },
            {
                path: 'offer',
                loadChildren: './offer/offer.module#MyWeddingOfferExtModule'
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
