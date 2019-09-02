import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { IAlbum } from 'app/shared/model/album.model';
import { IPhoto } from 'app/shared/model/photo.model';
import { IEventDate } from 'app/shared/model/event-date.model';

export interface IOffer {
    id?: number;
    description?: string;
    minPrice?: number;
    maxPrice?: number;
    priceUnit?: string;
    weddingHall?: IWeddingHall;
    reservationOrder?: IReservationOrder;
    album?: IAlbum;
    photo?: IPhoto;
    eventDates?: IEventDate[];
}

export class Offer implements IOffer {
    constructor(
        public id?: number,
        public description?: string,
        public minPrice?: number,
        public maxPrice?: number,
        public priceUnit?: string,
        public weddingHall?: IWeddingHall,
        public reservationOrder?: IReservationOrder,
        public album?: IAlbum,
        public photo?: IPhoto,
        public eventDates?: IEventDate[]
    ) {}
}
