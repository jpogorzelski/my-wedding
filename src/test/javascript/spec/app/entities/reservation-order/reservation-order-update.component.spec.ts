/* tslint:disable max-line-length */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MyWeddingTestModule } from '../../../test.module';
import { ReservationOrderUpdateComponent } from 'app/entities/ext/reservation-order/reservation-order-update.component';
import { ReservationOrderService } from 'app/entities/ext/reservation-order/reservation-order.service';
import { ReservationOrder } from 'app/shared/model/reservation-order.model';

describe('Component Tests', () => {
    describe('ReservationOrder Management Update Component', () => {
        let comp: ReservationOrderUpdateComponent;
        let fixture: ComponentFixture<ReservationOrderUpdateComponent>;
        let service: ReservationOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [ReservationOrderUpdateComponent]
            })
                .overrideTemplate(ReservationOrderUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ReservationOrderUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ReservationOrderService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ReservationOrder(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.reservationOrder = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ReservationOrder();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.reservationOrder = entity;
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
