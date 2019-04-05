/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MyWeddingTestModule } from '../../../test.module';
import { AlbumComponent } from 'app/entities/album/album.component';
import { AlbumService } from 'app/entities/album/album.service';
import { Album } from 'app/shared/model/album.model';

describe('Component Tests', () => {
    describe('Album Management Component', () => {
        let comp: AlbumComponent;
        let fixture: ComponentFixture<AlbumComponent>;
        let service: AlbumService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MyWeddingTestModule],
                declarations: [AlbumComponent],
                providers: []
            })
                .overrideTemplate(AlbumComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AlbumComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AlbumService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Album(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.albums[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
