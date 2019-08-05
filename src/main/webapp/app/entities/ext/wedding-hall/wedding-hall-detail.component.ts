import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { IPhoto } from 'app/shared/model/photo.model';
import { JhiDataUtils } from 'ng-jhipster';

@Component({
    selector: 'jhi-wedding-hall-detail',
    templateUrl: './wedding-hall-detail.component.html'
})
export class WeddingHallDetailComponent implements OnInit {
    weddingHall: IWeddingHall;

    constructor(protected activatedRoute: ActivatedRoute, protected dataUtils: JhiDataUtils) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weddingHall }) => {
            this.weddingHall = weddingHall;
        });
    }

    previousState() {
        window.history.back();
    }

    trackPhotosById(index: number, item: IPhoto) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
}
