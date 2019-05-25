package io.pogorzelski.mywedding.web.rest;

import java.net.URISyntaxException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.jhipster.web.util.ResponseUtil;
import io.pogorzelski.mywedding.domain.Customer;
import io.pogorzelski.mywedding.service.CustomerService;
import io.pogorzelski.mywedding.service.UserService;
import io.pogorzelski.mywedding.web.rest.errors.BadRequestAlertException;
import io.pogorzelski.mywedding.web.rest.errors.CustomerAccessDeniedException;
import io.pogorzelski.mywedding.web.rest.util.HeaderUtil;

/**
 * REST controller for managing Customer.
 */
@RestController
@RequestMapping("/api/ext")
public class ExtCustomerResource {

    private static final String ENTITY_NAME = "customer";
    private final Logger log = LoggerFactory.getLogger(ExtCustomerResource.class);
    private final CustomerService customerService;
    private final UserService userService;

    public ExtCustomerResource(CustomerService customerService, UserService userService) {
        this.customerService = customerService;
        this.userService = userService;
    }

    /**
     * PUT  /customers : Updates currently logged in customer.
     *
     * @param customer the customer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated customer,
     * or with status 403 (Forbidden) if the customer's id doesn't match with logged in,
     * or with status 400 (Bad Request) if the customer is not valid,
     * or with status 500 (Internal Server Error) if the customer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/customers")
    public ResponseEntity<Customer> updateCustomer(@RequestBody Customer customer) throws URISyntaxException {
        log.debug("REST request to update current Customer : {}", customer);
        if (customer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        return userService.getCustomer()
            .filter(customerFromSession -> customerFromSession.getId().equals(customer.getId()))
            .map(c -> customer)
            .map(customerService::save)
            .map(result -> ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, customer.getId().toString()))
                .body(result))
            .orElseThrow(CustomerAccessDeniedException::new);
    }

    /**
     * GET  /customers/current : get the "current" customer.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the customer, or with status 404 (Not Found)
     */
    @GetMapping("/customers/current")
    public ResponseEntity<Customer> getCurrentCustomer() {
        log.debug("REST request to get currently logged in Customer");
        final Optional<Customer> customer = userService.getUserWithAuthorities()
            .flatMap(customerService::findOneByUser);
        return ResponseUtil.wrapOrNotFound(customer);
    }


}
