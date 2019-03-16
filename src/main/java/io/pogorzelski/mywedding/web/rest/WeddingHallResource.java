package io.pogorzelski.mywedding.web.rest;
import io.pogorzelski.mywedding.domain.WeddingHall;
import io.pogorzelski.mywedding.service.WeddingHallService;
import io.pogorzelski.mywedding.web.rest.errors.BadRequestAlertException;
import io.pogorzelski.mywedding.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing WeddingHall.
 */
@RestController
@RequestMapping("/api")
public class WeddingHallResource {

    private final Logger log = LoggerFactory.getLogger(WeddingHallResource.class);

    private static final String ENTITY_NAME = "weddingHall";

    private final WeddingHallService weddingHallService;

    public WeddingHallResource(WeddingHallService weddingHallService) {
        this.weddingHallService = weddingHallService;
    }

    /**
     * POST  /wedding-halls : Create a new weddingHall.
     *
     * @param weddingHall the weddingHall to create
     * @return the ResponseEntity with status 201 (Created) and with body the new weddingHall, or with status 400 (Bad Request) if the weddingHall has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/wedding-halls")
    public ResponseEntity<WeddingHall> createWeddingHall(@Valid @RequestBody WeddingHall weddingHall) throws URISyntaxException {
        log.debug("REST request to save WeddingHall : {}", weddingHall);
        if (weddingHall.getId() != null) {
            throw new BadRequestAlertException("A new weddingHall cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WeddingHall result = weddingHallService.save(weddingHall);
        return ResponseEntity.created(new URI("/api/wedding-halls/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /wedding-halls : Updates an existing weddingHall.
     *
     * @param weddingHall the weddingHall to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated weddingHall,
     * or with status 400 (Bad Request) if the weddingHall is not valid,
     * or with status 500 (Internal Server Error) if the weddingHall couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/wedding-halls")
    public ResponseEntity<WeddingHall> updateWeddingHall(@Valid @RequestBody WeddingHall weddingHall) throws URISyntaxException {
        log.debug("REST request to update WeddingHall : {}", weddingHall);
        if (weddingHall.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WeddingHall result = weddingHallService.save(weddingHall);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, weddingHall.getId().toString()))
            .body(result);
    }

    /**
     * GET  /wedding-halls : get all the weddingHalls.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of weddingHalls in body
     */
    @GetMapping("/wedding-halls")
    public List<WeddingHall> getAllWeddingHalls() {
        log.debug("REST request to get all WeddingHalls");
        return weddingHallService.findAll();
    }

    /**
     * GET  /wedding-halls/:id : get the "id" weddingHall.
     *
     * @param id the id of the weddingHall to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the weddingHall, or with status 404 (Not Found)
     */
    @GetMapping("/wedding-halls/{id}")
    public ResponseEntity<WeddingHall> getWeddingHall(@PathVariable Long id) {
        log.debug("REST request to get WeddingHall : {}", id);
        Optional<WeddingHall> weddingHall = weddingHallService.findOne(id);
        return ResponseUtil.wrapOrNotFound(weddingHall);
    }

    /**
     * DELETE  /wedding-halls/:id : delete the "id" weddingHall.
     *
     * @param id the id of the weddingHall to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/wedding-halls/{id}")
    public ResponseEntity<Void> deleteWeddingHall(@PathVariable Long id) {
        log.debug("REST request to delete WeddingHall : {}", id);
        weddingHallService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/wedding-halls?query=:query : search for the weddingHall corresponding
     * to the query.
     *
     * @param query the query of the weddingHall search
     * @return the result of the search
     */
    @GetMapping("/_search/wedding-halls")
    public List<WeddingHall> searchWeddingHalls(@RequestParam String query) {
        log.debug("REST request to search WeddingHalls for query {}", query);
        return weddingHallService.search(query);
    }

}
