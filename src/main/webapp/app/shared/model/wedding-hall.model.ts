import { IAddress } from 'app/shared/model/address.model';
import { ICompany } from 'app/shared/model/company.model';

export interface IWeddingHall {
    id?: number;
    hallName?: string;
    address?: IAddress;
    company?: ICompany;
}

export class WeddingHall implements IWeddingHall {
    constructor(public id?: number, public hallName?: string, public address?: IAddress, public company?: ICompany) {}
}
