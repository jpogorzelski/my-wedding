import { IUser } from 'app/core/user/user.model';
import { IAddress } from 'app/shared/model/address.model';

export interface ICustomer {
    id?: number;
    phoneNumber?: string;
    user?: IUser;
    address?: IAddress;
}

export class Customer implements ICustomer {
    constructor(public id?: number, public phoneNumber?: string, public user?: IUser, public address?: IAddress) {}
}
