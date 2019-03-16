import { ICountry } from 'app/shared/model/country.model';
import { IProvince } from 'app/shared/model/province.model';
import { ICity } from 'app/shared/model/city.model';

export interface IAddress {
    id?: number;
    street?: string;
    houseNo?: string;
    flatNo?: string;
    postalCode?: string;
    country?: ICountry;
    province?: IProvince;
    city?: ICity;
}

export class Address implements IAddress {
    constructor(
        public id?: number,
        public street?: string,
        public houseNo?: string,
        public flatNo?: string,
        public postalCode?: string,
        public country?: ICountry,
        public province?: IProvince,
        public city?: ICity
    ) {}
}
