import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventDate } from 'app/shared/model/event-date.model';

@Component({
    selector: 'jhi-event-date-detail',
    templateUrl: './event-date-detail.component.html'
})
export class EventDateDetailComponent implements OnInit {
    eventDate: IEventDate;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventDate }) => {
            this.eventDate = eventDate;
        });
    }

    previousState() {
        window.history.back();
    }
}
