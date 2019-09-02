import { Moment } from 'moment';
import { IOffer } from 'app/shared/model/offer.model';

export interface IEventDate {
    id?: number;
    date?: Moment;
    offer?: IOffer;
}

export class EventDate implements IEventDate {
    constructor(public id?: number, public date?: Moment, public offer?: IOffer) {}
}
