/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MyWeddingTestModule } from '../../../test.module';
import { WeddingHallComponent } from 'app/entities/wedding-hall/wedding-hall.component';
import { WeddingHallService } from 'app/entities/wedding-hall/wedding-hall.service';
import { WeddingHall } from 'app/shared/model/wedding-hall.model';

describe('Component Tests', () => {
    describe('WeddingHall Management Component', () => {
        let comp: WeddingHallComponent;
        let fixture: ComponentFixture<WeddingHallComponent>;
        let service: WeddingHallService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [WeddingHallComponent],
                providers: []
            })
                .overrideTemplate(WeddingHallComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(WeddingHallComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeddingHallService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new WeddingHall(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.weddingHalls[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
