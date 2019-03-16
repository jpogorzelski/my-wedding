import { IProvince } from 'app/shared/model/province.model';
import { ICity } from 'app/shared/model/city.model';

export interface ICountry {
    id?: number;
    countryName?: string;
    provinces?: IProvince[];
    cities?: ICity[];
}

export class Country implements ICountry {
    constructor(public id?: number, public countryName?: string, public provinces?: IProvince[], public cities?: ICity[]) {}
}
