import { ICountry } from 'app/shared/model/country.model';
import { ICity } from 'app/shared/model/city.model';

export interface IProvince {
    id?: number;
    provinceName?: string;
    country?: ICountry;
    cities?: ICity[];
}

export class Province implements IProvince {
    constructor(public id?: number, public provinceName?: string, public country?: ICountry, public cities?: ICity[]) {}
}
