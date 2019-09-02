/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyWeddingTestModule } from '../../../test.module';
import { EventDateDetailComponent } from 'app/entities/event-date/event-date-detail.component';
import { EventDate } from 'app/shared/model/event-date.model';

describe('Component Tests', () => {
    describe('EventDate Management Detail Component', () => {
        let comp: EventDateDetailComponent;
        let fixture: ComponentFixture<EventDateDetailComponent>;
        const route = ({ data: of({ eventDate: new EventDate(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [EventDateDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(EventDateDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EventDateDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.eventDate).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
