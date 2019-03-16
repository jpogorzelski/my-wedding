import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
                path: 'address',
                loadChildren: './address/address.module#MyWeddingAddressModule'
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
                path: 'address',
                loadChildren: './address/address.module#MyWeddingAddressModule'
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
                path: 'address',
                loadChildren: './address/address.module#MyWeddingAddressModule'
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
                path: 'address',
                loadChildren: './address/address.module#MyWeddingAddressModule'
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
                path: 'country',
                loadChildren: './country/country.module#MyWeddingCountryModule'
            },
            {
                path: 'city',
                loadChildren: './city/city.module#MyWeddingCityModule'
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
