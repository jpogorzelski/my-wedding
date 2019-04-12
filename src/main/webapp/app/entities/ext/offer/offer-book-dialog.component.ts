import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from './offer.service';

@Component({
    selector: 'jhi-offer-book-dialog',
    templateUrl: './offer-book-dialog.component.html'
})
export class OfferBookDialogComponent {
    offer: IOffer;

    constructor(protected offerService: OfferService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmBook(offer: IOffer) {
        this.offerService.book(offer).subscribe(response => {
            this.eventManager.broadcast({
                name: 'offerListModification',
                content: 'Bookd an offer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-offer-book-popup',
    template: ''
})
export class OfferBookPopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ offer }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(OfferBookDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.offer = offer;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/ext/offer', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/ext/offer', { outlets: { popup: null } }]);
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
