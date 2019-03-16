/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MyWeddingTestModule } from '../../../test.module';
import { WeddingHallDeleteDialogComponent } from 'app/entities/wedding-hall/wedding-hall-delete-dialog.component';
import { WeddingHallService } from 'app/entities/wedding-hall/wedding-hall.service';

describe('Component Tests', () => {
    describe('WeddingHall Management Delete Component', () => {
        let comp: WeddingHallDeleteDialogComponent;
        let fixture: ComponentFixture<WeddingHallDeleteDialogComponent>;
        let service: WeddingHallService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [WeddingHallDeleteDialogComponent]
            })
                .overrideTemplate(WeddingHallDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(WeddingHallDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeddingHallService);
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
