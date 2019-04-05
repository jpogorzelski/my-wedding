import { ICountry } from 'app/shared/model/country.model';
import { IProvince } from 'app/shared/model/province.model';
import { ICity } from 'app/shared/model/city.model';
import { ICompany } from 'app/shared/model/company.model';

export interface IWeddingHall {
    id?: number;
    hallName?: string;
    country?: ICountry;
    province?: IProvince;
    city?: ICity;
    company?: ICompany;
}

export class WeddingHall implements IWeddingHall {
    constructor(
        public id?: number,
        public hallName?: string,
        public country?: ICountry,
        public province?: IProvince,
        public city?: ICity,
        public company?: ICompany
    ) {}
}
