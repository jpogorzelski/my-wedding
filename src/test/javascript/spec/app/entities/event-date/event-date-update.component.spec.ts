/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MyWeddingTestModule } from '../../../test.module';
import { EventDateUpdateComponent } from 'app/entities/event-date/event-date-update.component';
import { EventDateService } from 'app/entities/event-date/event-date.service';
import { EventDate } from 'app/shared/model/event-date.model';

describe('Component Tests', () => {
    describe('EventDate Management Update Component', () => {
        let comp: EventDateUpdateComponent;
        let fixture: ComponentFixture<EventDateUpdateComponent>;
        let service: EventDateService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [EventDateUpdateComponent]
            })
                .overrideTemplate(EventDateUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EventDateUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventDateService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new EventDate(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.eventDate = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new EventDate();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.eventDate = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
