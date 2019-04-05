import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IAlbum } from 'app/shared/model/album.model';
import { AlbumService } from './album.service';
import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from 'app/entities/wedding-hall';

@Component({
    selector: 'jhi-album-update',
    templateUrl: './album-update.component.html'
})
export class AlbumUpdateComponent implements OnInit {
    album: IAlbum;
    isSaving: boolean;

    weddinghalls: IWeddingHall[];
    created: string;

    constructor(
        protected dataUtils: JhiDataUtils,
        protected jhiAlertService: JhiAlertService,
        protected albumService: AlbumService,
        protected weddingHallService: WeddingHallService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ album }) => {
            this.album = album;
            this.created = this.album.created != null ? this.album.created.format(DATE_TIME_FORMAT) : null;
        });
        this.weddingHallService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IWeddingHall[]>) => mayBeOk.ok),
                map((response: HttpResponse<IWeddingHall[]>) => response.body)
            )
            .subscribe((res: IWeddingHall[]) => (this.weddinghalls = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.album.created = this.created != null ? moment(this.created, DATE_TIME_FORMAT) : null;
        if (this.album.id !== undefined) {
            this.subscribeToSaveResponse(this.albumService.update(this.album));
        } else {
            this.subscribeToSaveResponse(this.albumService.create(this.album));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlbum>>) {
        result.subscribe((res: HttpResponse<IAlbum>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackWeddingHallById(index: number, item: IWeddingHall) {
        return item.id;
    }
}
