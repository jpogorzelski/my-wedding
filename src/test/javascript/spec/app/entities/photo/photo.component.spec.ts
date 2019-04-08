/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MyWeddingTestModule } from '../../../test.module';
import { PhotoComponent } from 'app/entities/photo/photo.component';
import { PhotoService } from 'app/entities/photo/photo.service';
import { Photo } from 'app/shared/model/photo.model';

describe('Component Tests', () => {
    describe('Photo Management Component', () => {
        let comp: PhotoComponent;
        let fixture: ComponentFixture<PhotoComponent>;
        let service: PhotoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [PhotoComponent],
                providers: []
            })
                .overrideTemplate(PhotoComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PhotoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhotoService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Photo(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.photos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
