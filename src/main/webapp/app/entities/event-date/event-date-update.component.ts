import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IEventDate } from 'app/shared/model/event-date.model';
import { EventDateService } from './event-date.service';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from 'app/entities/offer';

@Component({
    selector: 'jhi-event-date-update',
    templateUrl: './event-date-update.component.html'
})
export class EventDateUpdateComponent implements OnInit {
    eventDate: IEventDate;
    isSaving: boolean;

    offers: IOffer[];
    dateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected eventDateService: EventDateService,
        protected offerService: OfferService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventDate }) => {
            this.eventDate = eventDate;
        });
        this.offerService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IOffer[]>) => mayBeOk.ok),
                map((response: HttpResponse<IOffer[]>) => response.body)
            )
            .subscribe((res: IOffer[]) => (this.offers = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.eventDate.id !== undefined) {
            this.subscribeToSaveResponse(this.eventDateService.update(this.eventDate));
        } else {
            this.subscribeToSaveResponse(this.eventDateService.create(this.eventDate));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventDate>>) {
        result.subscribe((res: HttpResponse<IEventDate>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackOfferById(index: number, item: IOffer) {
        return item.id;
    }
}
