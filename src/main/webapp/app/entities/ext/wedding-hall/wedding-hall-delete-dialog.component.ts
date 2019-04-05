import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWeddingHall } from 'app/shared/model/wedding-hall.model';
import { WeddingHallService } from './wedding-hall.service';

@Component({
    selector: 'jhi-wedding-hall-delete-dialog',
    templateUrl: './wedding-hall-delete-dialog.component.html'
})
export class WeddingHallDeleteDialogComponent {
    weddingHall: IWeddingHall;

    constructor(
        protected weddingHallService: WeddingHallService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.weddingHallService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'weddingHallListModification',
                content: 'Deleted an weddingHall'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-wedding-hall-delete-popup',
    template: ''
})
export class WeddingHallDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weddingHall }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(WeddingHallDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.weddingHall = weddingHall;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/ext/wedding-hall', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/ext/wedding-hall', { outlets: { popup: null } }]);
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
