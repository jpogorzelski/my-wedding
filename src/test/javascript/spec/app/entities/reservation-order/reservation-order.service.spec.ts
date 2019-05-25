/* tslint:disable max-line-length */
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { map, take } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { ReservationOrderService } from 'app/entities/ext/reservation-order/reservation-order.service';
import { IReservationOrder, ReservationOrder } from 'app/shared/model/reservation-order.model';

describe('Service Tests', () => {
    describe('ReservationOrder Service', () => {
        let injector: TestBed;
        let service: ReservationOrderService;
        let httpMock: HttpTestingController;
        let elemDefault: IReservationOrder;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(ReservationOrderService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new ReservationOrder(0, false, 0, 0, false, currentDate, currentDate);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        createDate: currentDate.format(DATE_FORMAT),
                        modificationDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a ReservationOrder', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        createDate: currentDate.format(DATE_FORMAT),
                        modificationDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        createDate: currentDate,
                        modificationDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new ReservationOrder(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a ReservationOrder', async () => {
                const returnedFromService = Object.assign(
                    {
                        reservationConfirmed: true,
                        guestCount: 1,
                        downPaymentAmount: 1,
                        downPaymentSettled: true,
                        createDate: currentDate.format(DATE_FORMAT),
                        modificationDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        createDate: currentDate,
                        modificationDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of ReservationOrder', async () => {
                const returnedFromService = Object.assign(
                    {
                        reservationConfirmed: true,
                        guestCount: 1,
                        downPaymentAmount: 1,
                        downPaymentSettled: true,
                        createDate: currentDate.format(DATE_FORMAT),
                        modificationDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        createDate: currentDate,
                        modificationDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a ReservationOrder', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
