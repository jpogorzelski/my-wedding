package io.pogorzelski.mywedding.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.jhipster.web.util.ResponseUtil;
import io.pogorzelski.mywedding.domain.Authority;
import io.pogorzelski.mywedding.domain.ReservationOrder;
import io.pogorzelski.mywedding.domain.User;
import io.pogorzelski.mywedding.security.AuthoritiesConstants;
import io.pogorzelski.mywedding.service.ReservationOrderService;
import io.pogorzelski.mywedding.service.UserService;
import io.pogorzelski.mywedding.web.rest.errors.BadRequestAlertException;
import io.pogorzelski.mywedding.web.rest.util.HeaderUtil;

/**
 * REST controller for managing ReservationOrder.
 */
@RestController
@RequestMapping("/api")
public class ReservationOrderResource {

    private final Logger log = LoggerFactory.getLogger(ReservationOrderResource.class);

    private static final String ENTITY_NAME = "reservationOrder";

    private final ReservationOrderService reservationOrderService;
    private final UserService userService;

    public ReservationOrderResource(ReservationOrderService reservationOrderService, UserService userService) {
        this.reservationOrderService = reservationOrderService;
        this.userService = userService;
    }

    /**
     * POST  /reservation-orders : Create a new reservationOrder.
     *
     * @param reservationOrder the reservationOrder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new reservationOrder, or with status 400 (Bad Request) if the reservationOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/reservation-orders")
    public ResponseEntity<ReservationOrder> createReservationOrder(@Valid @RequestBody ReservationOrder reservationOrder) throws URISyntaxException {
        log.debug("REST request to save ReservationOrder : {}", reservationOrder);
        if (reservationOrder.getId() != null) {
            throw new BadRequestAlertException("A new reservationOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ReservationOrder result = reservationOrderService.save(reservationOrder);
        return ResponseEntity.created(new URI("/api/reservation-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /reservation-orders : Updates an existing reservationOrder.
     *
     * @param reservationOrder the reservationOrder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated reservationOrder,
     * or with status 400 (Bad Request) if the reservationOrder is not valid,
     * or with status 500 (Internal Server Error) if the reservationOrder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/reservation-orders")
    public ResponseEntity<ReservationOrder> updateReservationOrder(@Valid @RequestBody ReservationOrder reservationOrder) throws URISyntaxException {
        log.debug("REST request to update ReservationOrder : {}", reservationOrder);
        if (reservationOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ReservationOrder result = reservationOrderService.save(reservationOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, reservationOrder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /reservation-orders : get all the reservationOrders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of reservationOrders in body
     */
    @GetMapping("/reservation-orders")
    public List<ReservationOrder> getAllReservationOrders() {
        log.debug("REST request to get all ReservationOrders");

        final Set<String> roles = userService.getUserWithAuthorities()
            .map(User::getAuthorities)
            .orElse(Collections.emptySet()).stream()
            .map(Authority::getName)
            .collect(Collectors.toSet());

        if (roles.contains(AuthoritiesConstants.ADMIN)) {
            return reservationOrderService.findAll();
        } else if (roles.contains(AuthoritiesConstants.COMPANY_OWNER)) {
            return userService.getCompany()
                .map(reservationOrderService::findByCompany)
                .orElse(Collections.emptyList());
        } else if (roles.contains(AuthoritiesConstants.CUSTOMER)) {
            return userService.getCustomer()
                .map(reservationOrderService::findByCustomer)
                .orElse(Collections.emptyList());
        }
        return Collections.emptyList();
    }

    /**
     * GET  /reservation-orders/:id : get the "id" reservationOrder.
     *
     * @param id the id of the reservationOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the reservationOrder, or with status 404 (Not Found)
     */
    @GetMapping("/reservation-orders/{id}")
    public ResponseEntity<ReservationOrder> getReservationOrder(@PathVariable Long id) {
        log.debug("REST request to get ReservationOrder : {}", id);
        Optional<ReservationOrder> reservationOrder = reservationOrderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reservationOrder);
    }

    /**
     * GET  /reservation-orders/offer/:id : get the reservationOrder by offer "id".
     *
     * @param id the id of the offer of reservationOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the reservationOrder, or with status 404 (Not Found)
     */
    @GetMapping("/reservation-orders/offer/{id}")
    public ResponseEntity<ReservationOrder> getReservationOrderByOfferId(@PathVariable Long id) {
        log.debug("REST request to get ReservationOrder by Offer : {}", id);
        Optional<ReservationOrder> reservationOrder = reservationOrderService.findByOfferId(id);
        return ResponseUtil.wrapOrNotFound(reservationOrder);
    }

    /**
     * DELETE  /reservation-orders/:id : delete the "id" reservationOrder.
     *
     * @param id the id of the reservationOrder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/reservation-orders/{id}")
    public ResponseEntity<Void> deleteReservationOrder(@PathVariable Long id) {
        log.debug("REST request to delete ReservationOrder : {}", id);
        reservationOrderService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
