import { Moment } from 'moment';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { IPhoto } from 'app/shared/model/photo.model';

export interface IAlbum {
    id?: number;
    title?: string;
    description?: any;
    created?: Moment;
    hallName?: IWeddingHall;
    photos?: IPhoto[];
}

export class Album implements IAlbum {
    constructor(
        public id?: number,
        public title?: string,
        public description?: any,
        public created?: Moment,
        public hallName?: IWeddingHall,
        public photos?: IPhoto[]
    ) {}
}
