/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MyWeddingTestModule } from '../../../test.module';
import { EventDateDeleteDialogComponent } from 'app/entities/event-date/event-date-delete-dialog.component';
import { EventDateService } from 'app/entities/event-date/event-date.service';

describe('Component Tests', () => {
    describe('EventDate Management Delete Component', () => {
        let comp: EventDateDeleteDialogComponent;
        let fixture: ComponentFixture<EventDateDeleteDialogComponent>;
        let service: EventDateService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [EventDateDeleteDialogComponent]
            })
                .overrideTemplate(EventDateDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EventDateDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventDateService);
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
