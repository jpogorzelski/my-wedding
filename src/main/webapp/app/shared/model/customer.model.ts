import { IUser } from 'app/core/user/user.model';
import { ICountry } from 'app/shared/model/country.model';
import { IProvince } from 'app/shared/model/province.model';
import { ICity } from 'app/shared/model/city.model';

export interface ICustomer {
    id?: number;
    phoneNumber?: string;
    street?: string;
    houseNo?: string;
    flatNo?: string;
    postalCode?: string;
    user?: IUser;
    country?: ICountry;
    province?: IProvince;
    city?: ICity;
}

export class Customer implements ICustomer {
    constructor(
        public id?: number,
        public phoneNumber?: string,
        public street?: string,
        public houseNo?: string,
        public flatNo?: string,
        public postalCode?: string,
        public user?: IUser,
        public country?: ICountry,
        public province?: IProvince,
        public city?: ICity
    ) {}
}
