import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEventDate } from 'app/shared/model/event-date.model';
import { EventDateService } from './event-date.service';

@Component({
    selector: 'jhi-event-date-delete-dialog',
    templateUrl: './event-date-delete-dialog.component.html'
})
export class EventDateDeleteDialogComponent {
    eventDate: IEventDate;

    constructor(
        protected eventDateService: EventDateService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.eventDateService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventDateListModification',
                content: 'Deleted an eventDate'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-date-delete-popup',
    template: ''
})
export class EventDateDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventDate }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EventDateDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.eventDate = eventDate;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/event-date', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/event-date', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
