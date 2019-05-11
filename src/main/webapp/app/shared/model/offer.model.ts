import { Moment } from 'moment';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';

export interface IOffer {
    id?: number;
    eventDate?: Moment;
    description?: string;
    pricePerCapita?: number;
    available?: boolean;
    startDate?: Moment;
    endDate?: Moment;
    weddingHall?: IWeddingHall;
    reservationOrder?: IReservationOrder;
}

export class Offer implements IOffer {
    constructor(
        public id?: number,
        public eventDate?: Moment,
        public description?: string,
        public pricePerCapita?: number,
        public available?: boolean,
        public startDate?: Moment,
        public endDate?: Moment,
        public weddingHall?: IWeddingHall,
        public reservationOrder?: IReservationOrder
    ) {
        this.available = this.available || false;
    }
}
