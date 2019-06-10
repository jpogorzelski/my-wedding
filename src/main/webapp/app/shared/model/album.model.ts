import { Moment } from 'moment';
import { IPhoto } from 'app/shared/model/photo.model';

export interface IAlbum {
    id?: number;
    title?: string;
    description?: any;
    created?: Moment;
    photos?: IPhoto[];
}

export class Album implements IAlbum {
    constructor(public id?: number, public title?: string, public description?: any, public created?: Moment, public photos?: IPhoto[]) {}
}
