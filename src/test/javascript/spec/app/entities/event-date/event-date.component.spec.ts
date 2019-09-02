/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MyWeddingTestModule } from '../../../test.module';
import { EventDateComponent } from 'app/entities/event-date/event-date.component';
import { EventDateService } from 'app/entities/event-date/event-date.service';
import { EventDate } from 'app/shared/model/event-date.model';

describe('Component Tests', () => {
    describe('EventDate Management Component', () => {
        let comp: EventDateComponent;
        let fixture: ComponentFixture<EventDateComponent>;
        let service: EventDateService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [EventDateComponent],
                providers: []
            })
                .overrideTemplate(EventDateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EventDateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventDateService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new EventDate(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.eventDates[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
