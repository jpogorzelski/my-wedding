/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MyWeddingTestModule } from '../../../test.module';
import { ReservationOrderDeleteDialogComponent } from 'app/entities/reservation-order/reservation-order-delete-dialog.component';
import { ReservationOrderService } from 'app/entities/reservation-order/reservation-order.service';

describe('Component Tests', () => {
    describe('ReservationOrder Management Delete Component', () => {
        let comp: ReservationOrderDeleteDialogComponent;
        let fixture: ComponentFixture<ReservationOrderDeleteDialogComponent>;
        let service: ReservationOrderService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [ReservationOrderDeleteDialogComponent]
            })
                .overrideTemplate(ReservationOrderDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ReservationOrderDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ReservationOrderService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
