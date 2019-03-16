/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyWeddingTestModule } from '../../../test.module';
import { WeddingHallDetailComponent } from 'app/entities/wedding-hall/wedding-hall-detail.component';
import { WeddingHall } from 'app/shared/model/wedding-hall.model';

describe('Component Tests', () => {
    describe('WeddingHall Management Detail Component', () => {
        let comp: WeddingHallDetailComponent;
        let fixture: ComponentFixture<WeddingHallDetailComponent>;
        const route = ({ data: of({ weddingHall: new WeddingHall(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [WeddingHallDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(WeddingHallDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(WeddingHallDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.weddingHall).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
