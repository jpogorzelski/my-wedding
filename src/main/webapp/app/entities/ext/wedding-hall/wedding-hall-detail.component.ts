import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeddingHall } from 'app/shared/model/wedding-hall.model';

@Component({
    selector: 'jhi-wedding-hall-detail',
    templateUrl: './wedding-hall-detail.component.html'
})
export class WeddingHallDetailComponent implements OnInit {
    weddingHall: IWeddingHall;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weddingHall }) => {
            this.weddingHall = weddingHall;
        });
    }

    previousState() {
        window.history.back();
    }
}
