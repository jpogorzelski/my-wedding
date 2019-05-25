package io.pogorzelski.mywedding.web.rest;

import io.github.jhipster.web.util.ResponseUtil;
import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.Offer;
import io.pogorzelski.mywedding.domain.ReservationOrder;
import io.pogorzelski.mywedding.domain.WeddingHall;
import io.pogorzelski.mywedding.security.AuthoritiesConstants;
import io.pogorzelski.mywedding.service.*;
import io.pogorzelski.mywedding.web.rest.errors.BadRequestAlertException;
import io.pogorzelski.mywedding.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Company.
 */
@RestController
@RequestMapping("/api")
public class CompanyResource {

    private final Logger log = LoggerFactory.getLogger(CompanyResource.class);

    private static final String ENTITY_NAME = "company";

    private final CompanyService companyService;
    private final UserService userService;
    private final WeddingHallService weddingHallService;
    private final OfferService offerService;
    private final ReservationOrderService reservationOrderService;

    public CompanyResource(CompanyService companyService, UserService userService, WeddingHallService weddingHallService, OfferService offerService, ReservationOrderService reservationOrderService) {
        this.companyService = companyService;
        this.userService = userService;
        this.weddingHallService = weddingHallService;
        this.offerService = offerService;
        this.reservationOrderService = reservationOrderService;
    }

    /**
     * POST  /companies : Create a new company.
     *
     * @param company the company to create
     * @return the ResponseEntity with status 201 (Created) and with body the new company, or with status 400 (Bad Request) if the company has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/companies")
    public ResponseEntity<Company> createCompany(@Valid @RequestBody Company company) throws URISyntaxException {
        log.debug("REST request to save Company : {}", company);
        if (company.getId() != null) {
            throw new BadRequestAlertException("A new company cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Company result = companyService.save(company);
        return ResponseEntity.created(new URI("/api/companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /companies : Updates an existing company.
     *
     * @param company the company to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated company,
     * or with status 400 (Bad Request) if the company is not valid,
     * or with status 500 (Internal Server Error) if the company couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/companies")
    public ResponseEntity<Company> updateCompany(@Valid @RequestBody Company company) throws URISyntaxException {
        log.debug("REST request to update Company : {}", company);
        if (company.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Company result = companyService.save(company);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, company.getId().toString()))
            .body(result);
    }

    /**
     * GET  /companies : get all the companies.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of companies in body
     */
    @GetMapping("/companies")
    public List<Company> getAllCompanies() {
        log.debug("REST request to get all Companies");
        return companyService.findAll();
    }

    /**
     * GET  /companies/:id : get the "id" company.
     *
     * @param id the id of the company to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the company, or with status 404 (Not Found)
     */
    @GetMapping("/companies/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable Long id) {
        log.debug("REST request to get Company : {}", id);
        Optional<Company> company = companyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(company);
    }

    /**
     * DELETE  /companies/:id : delete the "id" company.
     *
     * @param id the id of the company to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/companies/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        log.debug("REST request to delete Company : {}", id);
        companyService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/companies?query=:query : search for the company corresponding
     * to the query.
     *
     * @param query the query of the company search
     * @return the result of the search
     */
    @GetMapping("/_search/companies")
    public List<Company> searchCompanies(@RequestParam String query) {
        log.debug("REST request to search Companies for query {}", query);
        return companyService.search(query);
    }


    /**
     * GET  /companies/current : get the "current" company.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the customer, or with status 404 (Not Found)
     */
    @GetMapping("/companies/current")
    @Secured(AuthoritiesConstants.COMPANY_OWNER)
    public ResponseEntity<Company> getCurrentCompany() {
        log.debug("REST request to get currently logged in company");
        final Optional<Company> company = userService.getCompany();
        return ResponseUtil.wrapOrNotFound(company);
    }


    /**
     * GET  /companies/current/wedding-halls : get all the weddingHalls for currently logged in company owner.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of weddingHalls in body
     */
    @GetMapping("/companies/current/wedding-halls")
    @Secured(AuthoritiesConstants.COMPANY_OWNER)
    public List<WeddingHall> getCurrentCompanyWeddingHalls() {
        log.debug("REST request to get company's WeddingHalls");
        return userService.getCompany()
            .map(weddingHallService::findByCompany)
            .orElse(Collections.emptyList());
    }

    /**
     * GET  /companies/current/offers : get all the offers for currently logged in company owner.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of offers in body
     */
    @GetMapping("/companies/current/offers")
    @Secured(AuthoritiesConstants.COMPANY_OWNER)
    public List<Offer> getCurrentCompanyOffers() {
        log.debug("REST request to get company's Offers");
        return userService.getCompany()
            .map(offerService::findByCompany)
            .orElse(Collections.emptyList());
    }

    /**
     * GET  /companies/current/reservation-orders : get all the reservation-orders for currently logged in company owner.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of reservation-orders in body
     */
    @GetMapping("/companies/current/reservation-orders")
    @Secured(AuthoritiesConstants.COMPANY_OWNER)
    public List<ReservationOrder> getCurrentCompanyReservationOrders() {
        log.debug("REST request to get company's ReservationOrders");
        return userService.getCompany()
            .map(reservationOrderService::findByCompany)
            .orElse(Collections.emptyList());
    }
}
