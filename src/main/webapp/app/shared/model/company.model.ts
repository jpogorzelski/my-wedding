import { IAddress } from 'app/shared/model/address.model';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';

export interface ICompany {
    id?: number;
    companyName?: string;
    address?: IAddress;
    weddingHalls?: IWeddingHall[];
}

export class Company implements ICompany {
    constructor(public id?: number, public companyName?: string, public address?: IAddress, public weddingHalls?: IWeddingHall[]) {}
}
