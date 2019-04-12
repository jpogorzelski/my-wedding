package io.pogorzelski.mywedding.web.rest;
import io.pogorzelski.mywedding.domain.Offer;
import io.pogorzelski.mywedding.domain.ReservationOrder;
import io.pogorzelski.mywedding.service.OfferService;
import io.pogorzelski.mywedding.service.ReservationOrderService;
import io.pogorzelski.mywedding.web.rest.errors.BadRequestAlertException;
import io.pogorzelski.mywedding.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Offer.
 */
@RestController
@RequestMapping("/api")
public class OfferResource {

    private final Logger log = LoggerFactory.getLogger(OfferResource.class);

    private static final String ENTITY_NAME = "offer";

    private final OfferService offerService;
    private final ReservationOrderService reservationOrderService;

    public OfferResource(OfferService offerService, ReservationOrderService reservationOrderService) {
        this.offerService = offerService;
        this.reservationOrderService = reservationOrderService;
    }

    /**
     * POST  /offers : Create a new offer.
     *
     * @param offer the offer to create
     * @return the ResponseEntity with status 201 (Created) and with body the new offer, or with status 400 (Bad Request) if the offer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/offers")
    public ResponseEntity<Offer> createOffer(@Valid @RequestBody Offer offer) throws URISyntaxException {
        log.debug("REST request to save Offer : {}", offer);
        if (offer.getId() != null) {
            throw new BadRequestAlertException("A new offer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        offer.setAvailable(true);
        Offer result = offerService.save(offer);
        return ResponseEntity.created(new URI("/api/offers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /offers : Updates an existing offer.
     *
     * @param offer the offer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated offer,
     * or with status 400 (Bad Request) if the offer is not valid,
     * or with status 500 (Internal Server Error) if the offer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/offers")
    public ResponseEntity<Offer> updateOffer(@Valid @RequestBody Offer offer) throws URISyntaxException {
        log.debug("REST request to update Offer : {}", offer);
        if (offer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Offer result = offerService.save(offer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, offer.getId().toString()))
            .body(result);
    }

    /**
     * GET  /offers : get all the offers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of offers in body
     */
    @GetMapping("/offers")
    public List<Offer> getAllOffers() {
        log.debug("REST request to get all Offers");
        return offerService.findAll();
    }

    /**
     * GET  /offers/:id : get the "id" offer.
     *
     * @param id the id of the offer to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the offer, or with status 404 (Not Found)
     */
    @GetMapping("/offers/{id}")
    public ResponseEntity<Offer> getOffer(@PathVariable Long id) {
        log.debug("REST request to get Offer : {}", id);
        Optional<Offer> offer = offerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(offer);
    }

    /**
     * DELETE  /offers/:id : delete the "id" offer.
     *
     * @param id the id of the offer to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/offers/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        log.debug("REST request to delete Offer : {}", id);
        offerService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }


    /**
     * POST  /offers/:id/book : Book an offer.
     *
     * @param offer the offer to book
     * @return the ResponseEntity with status 201 (Booked) and with body the offer, or with status 400 (Bad Request) if the offer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/offers/{id}/book")
    public ResponseEntity<Offer> bookOffer(@Valid @RequestBody Offer offer) throws URISyntaxException {
        log.debug("REST request to book Offer : {}", offer);
        if (offer.getId() == null) {
            throw new BadRequestAlertException("Cannot book unexisting offer - missing ID", ENTITY_NAME, "idnull");
        }
        offer.setAvailable(false);
        ReservationOrder reservationOrder = new ReservationOrder();
        reservationOrder.setEventDate(offer);
        reservationOrder.setCreateDate(LocalDate.now());
        reservationOrder.setModificationDate(LocalDate.now());
        reservationOrder.setRequired(null); //todo fix naming and set user
        reservationOrder.setDownPaymentAmount(new BigDecimal("1000.0"));
        reservationOrder.setGuestCount(120);
        //todo change popup to page - there is need to enter above before submit
        Offer result = offerService.save(offer);
        reservationOrderService.save(reservationOrder);
        return ResponseEntity.created(new URI("/api/offers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

}
