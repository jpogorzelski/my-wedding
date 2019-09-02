import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'country',
                loadChildren: './country/country.module#MyWeddingCountryModule'
            },
            {
                path: 'province',
                loadChildren: './province/province.module#MyWeddingProvinceModule'
            },
            {
                path: 'city',
                loadChildren: './city/city.module#MyWeddingCityModule'
            },
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
            },
            {
                path: 'ext',
                loadChildren: './ext/ext.module#MyWeddingExtModule'
            },
            {
                path: 'album',
                loadChildren: './album/album.module#MyWeddingAlbumModule'
            },
            {
                path: 'photo',
                loadChildren: './photo/photo.module#MyWeddingPhotoModule'
            },
            {
                path: 'offer',
                loadChildren: './offer/offer.module#MyWeddingOfferModule'
            },
            {
                path: 'reservation-order',
                loadChildren: './reservation-order/reservation-order.module#MyWeddingReservationOrderModule'
            },
            {
                path: 'event-date',
                loadChildren: './event-date/event-date.module#MyWeddingEventDateModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyWeddingEntityModule {}
