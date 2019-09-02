package io.pogorzelski.mywedding.web.rest;
import io.pogorzelski.mywedding.domain.EventDate;
import io.pogorzelski.mywedding.repository.EventDateRepository;
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

/**
 * REST controller for managing EventDate.
 */
@RestController
@RequestMapping("/api")
public class EventDateResource {

    private final Logger log = LoggerFactory.getLogger(EventDateResource.class);

    private static final String ENTITY_NAME = "eventDate";

    private final EventDateRepository eventDateRepository;

    public EventDateResource(EventDateRepository eventDateRepository) {
        this.eventDateRepository = eventDateRepository;
    }

    /**
     * POST  /event-dates : Create a new eventDate.
     *
     * @param eventDate the eventDate to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventDate, or with status 400 (Bad Request) if the eventDate has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/event-dates")
    public ResponseEntity<EventDate> createEventDate(@Valid @RequestBody EventDate eventDate) throws URISyntaxException {
        log.debug("REST request to save EventDate : {}", eventDate);
        if (eventDate.getId() != null) {
            throw new BadRequestAlertException("A new eventDate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventDate result = eventDateRepository.save(eventDate);
        return ResponseEntity.created(new URI("/api/event-dates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /event-dates : Updates an existing eventDate.
     *
     * @param eventDate the eventDate to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventDate,
     * or with status 400 (Bad Request) if the eventDate is not valid,
     * or with status 500 (Internal Server Error) if the eventDate couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/event-dates")
    public ResponseEntity<EventDate> updateEventDate(@Valid @RequestBody EventDate eventDate) throws URISyntaxException {
        log.debug("REST request to update EventDate : {}", eventDate);
        if (eventDate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EventDate result = eventDateRepository.save(eventDate);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventDate.getId().toString()))
            .body(result);
    }

    /**
     * GET  /event-dates : get all the eventDates.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of eventDates in body
     */
    @GetMapping("/event-dates")
    public List<EventDate> getAllEventDates() {
        log.debug("REST request to get all EventDates");
        return eventDateRepository.findAll();
    }

    /**
     * GET  /event-dates/:id : get the "id" eventDate.
     *
     * @param id the id of the eventDate to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventDate, or with status 404 (Not Found)
     */
    @GetMapping("/event-dates/{id}")
    public ResponseEntity<EventDate> getEventDate(@PathVariable Long id) {
        log.debug("REST request to get EventDate : {}", id);
        Optional<EventDate> eventDate = eventDateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eventDate);
    }

    /**
     * DELETE  /event-dates/:id : delete the "id" eventDate.
     *
     * @param id the id of the eventDate to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/event-dates/{id}")
    public ResponseEntity<Void> deleteEventDate(@PathVariable Long id) {
        log.debug("REST request to delete EventDate : {}", id);
        eventDateRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
