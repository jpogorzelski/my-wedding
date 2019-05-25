/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyWeddingTestModule } from '../../../test.module';
import { ReservationOrderDetailComponent } from 'app/entities/ext/reservation-order/reservation-order-detail.component';
import { ReservationOrder } from 'app/shared/model/reservation-order.model';

describe('Component Tests', () => {
    describe('ReservationOrder Management Detail Component', () => {
        let comp: ReservationOrderDetailComponent;
        let fixture: ComponentFixture<ReservationOrderDetailComponent>;
        const route = ({ data: of({ reservationOrder: new ReservationOrder(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [ReservationOrderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ReservationOrderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ReservationOrderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.reservationOrder).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
