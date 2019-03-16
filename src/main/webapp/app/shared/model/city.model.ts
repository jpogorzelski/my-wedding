import { ICountry } from 'app/shared/model/country.model';
import { IProvince } from 'app/shared/model/province.model';

export interface ICity {
    id?: number;
    cityName?: string;
    country?: ICountry;
    province?: IProvince;
}

export class City implements ICity {
    constructor(public id?: number, public cityName?: string, public country?: ICountry, public province?: IProvince) {}
}
