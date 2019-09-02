import { ICountry } from 'app/shared/model/country.model';
import { IProvince } from 'app/shared/model/province.model';
import { ICity } from 'app/shared/model/city.model';
import { ICompany } from 'app/shared/model/company.model';
import { IOffer } from 'app/shared/model/offer.model';

export interface IWeddingHall {
    id?: number;
    hallName?: string;
    country?: ICountry;
    province?: IProvince;
    city?: ICity;
    company?: ICompany;
    offer?: IOffer;
}

export class WeddingHall implements IWeddingHall {
    constructor(
        public id?: number,
        public hallName?: string,
        public country?: ICountry,
        public province?: IProvince,
        public city?: ICity,
        public company?: ICompany,
        public offer?: IOffer
    ) {}
}
