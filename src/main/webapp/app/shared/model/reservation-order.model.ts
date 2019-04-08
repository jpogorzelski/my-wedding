import { Moment } from 'moment';
import { IOffer } from 'app/shared/model/offer.model';
import { ICustomer } from 'app/shared/model/customer.model';

export interface IReservationOrder {
    id?: number;
    reservationConfirmed?: boolean;
    guestCount?: number;
    downPaymentAmount?: number;
    downPaymentSettled?: boolean;
    createDate?: Moment;
    modificationDate?: Moment;
    eventDate?: IOffer;
    required?: ICustomer;
}

export class ReservationOrder implements IReservationOrder {
    constructor(
        public id?: number,
        public reservationConfirmed?: boolean,
        public guestCount?: number,
        public downPaymentAmount?: number,
        public downPaymentSettled?: boolean,
        public createDate?: Moment,
        public modificationDate?: Moment,
        public eventDate?: IOffer,
        public required?: ICustomer
    ) {
        this.reservationConfirmed = this.reservationConfirmed || false;
        this.downPaymentSettled = this.downPaymentSettled || false;
    }
}
