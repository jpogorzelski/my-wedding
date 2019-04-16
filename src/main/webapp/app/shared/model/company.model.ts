import { IUser } from 'app/core/user/user.model';
import { ICountry } from 'app/shared/model/country.model';
import { IProvince } from 'app/shared/model/province.model';
import { ICity } from 'app/shared/model/city.model';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';

export interface ICompany {
    id?: number;
    companyName?: string;
    street?: string;
    houseNo?: string;
    flatNo?: string;
    postalCode?: string;
    owner?: IUser;
    country?: ICountry;
    province?: IProvince;
    city?: ICity;
    weddingHalls?: IWeddingHall[];
}

export class Company implements ICompany {
    constructor(
        public id?: number,
        public companyName?: string,
        public street?: string,
        public houseNo?: string,
        public flatNo?: string,
        public postalCode?: string,
        public owner?: IUser,
        public country?: ICountry,
        public province?: IProvince,
        public city?: ICity,
        public weddingHalls?: IWeddingHall[]
    ) {}
}
