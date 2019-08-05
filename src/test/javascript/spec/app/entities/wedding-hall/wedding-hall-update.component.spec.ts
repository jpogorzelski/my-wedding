/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MyWeddingTestModule } from '../../../test.module';
import { WeddingHallUpdateComponent } from 'app/entities/wedding-hall/wedding-hall-update.component';
import { WeddingHallService } from 'app/entities/wedding-hall/wedding-hall.service';
import { WeddingHall } from 'app/shared/model/wedding-hall.model';

describe('Component Tests', () => {
    describe('WeddingHall Management Update Component', () => {
        let comp: WeddingHallUpdateComponent;
        let fixture: ComponentFixture<WeddingHallUpdateComponent>;
        let service: WeddingHallService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [WeddingHallUpdateComponent]
            })
                .overrideTemplate(WeddingHallUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(WeddingHallUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeddingHallService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new WeddingHall(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.weddingHall = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new WeddingHall();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.weddingHall = entity;
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
