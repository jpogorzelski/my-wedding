/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MyWeddingTestModule } from '../../../test.module';
import { ReservationOrderComponent } from 'app/entities/ext/reservation-order/reservation-order.component';
import { ReservationOrderService } from 'app/entities/ext/reservation-order/reservation-order.service';
import { ReservationOrder } from 'app/shared/model/reservation-order.model';

describe('Component Tests', () => {
    describe('ReservationOrder Management Component', () => {
        let comp: ReservationOrderComponent;
        let fixture: ComponentFixture<ReservationOrderComponent>;
        let service: ReservationOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [ReservationOrderComponent],
                providers: []
            })
                .overrideTemplate(ReservationOrderComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ReservationOrderComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ReservationOrderService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ReservationOrder(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.reservationOrders[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
