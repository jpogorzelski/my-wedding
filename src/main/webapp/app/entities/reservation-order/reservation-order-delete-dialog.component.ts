import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IReservationOrder } from 'app/shared/model/reservation-order.model';
import { ReservationOrderService } from './reservation-order.service';

@Component({
    selector: 'jhi-reservation-order-delete-dialog',
    templateUrl: './reservation-order-delete-dialog.component.html'
})
export class ReservationOrderDeleteDialogComponent {
    reservationOrder: IReservationOrder;

    constructor(
        protected reservationOrderService: ReservationOrderService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.reservationOrderService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'reservationOrderListModification',
                content: 'Deleted an reservationOrder'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-reservation-order-delete-popup',
    template: ''
})
export class ReservationOrderDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ reservationOrder }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ReservationOrderDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.reservationOrder = reservationOrder;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/reservation-order', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/reservation-order', { outlets: { popup: null } }]);
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
