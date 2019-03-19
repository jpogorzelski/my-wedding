package io.pogorzelski.mywedding.web.rest;

import io.github.jhipster.web.util.ResponseUtil;
import io.pogorzelski.mywedding.domain.Province;
import io.pogorzelski.mywedding.service.ProvinceService;
import io.pogorzelski.mywedding.web.rest.errors.BadRequestAlertException;
import io.pogorzelski.mywedding.web.rest.util.HeaderUtil;
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
 * REST controller for managing Province.
 */
@RestController
@RequestMapping("/api")
public class ProvinceResource {

    private final Logger log = LoggerFactory.getLogger(ProvinceResource.class);

    private static final String ENTITY_NAME = "province";

    private final ProvinceService provinceService;

    public ProvinceResource(ProvinceService provinceService) {
        this.provinceService = provinceService;
    }

    /**
     * POST  /provinces : Create a new province.
     *
     * @param province the province to create
     * @return the ResponseEntity with status 201 (Created) and with body the new province, or with status 400 (Bad Request) if the province has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/provinces")
    public ResponseEntity<Province> createProvince(@Valid @RequestBody Province province) throws URISyntaxException {
        log.debug("REST request to save Province : {}", province);
        if (province.getId() != null) {
            throw new BadRequestAlertException("A new province cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Province result = provinceService.save(province);
        return ResponseEntity.created(new URI("/api/provinces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /provinces : Updates an existing province.
     *
     * @param province the province to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated province,
     * or with status 400 (Bad Request) if the province is not valid,
     * or with status 500 (Internal Server Error) if the province couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/provinces")
    public ResponseEntity<Province> updateProvince(@Valid @RequestBody Province province) throws URISyntaxException {
        log.debug("REST request to update Province : {}", province);
        if (province.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Province result = provinceService.save(province);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, province.getId().toString()))
            .body(result);
    }

    /**
     * GET  /provinces : get all the provinces.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of provinces in body
     */
    @GetMapping("/provinces")
    public List<Province> getAllProvinces() {
        log.debug("REST request to get all Provinces");
        return provinceService.findAll();
    }

    /**
     * GET  /provinces/:id : get the "id" province.
     *
     * @param id the id of the province to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the province, or with status 404 (Not Found)
     */
    @GetMapping("/provinces/{id}")
    public ResponseEntity<Province> getProvince(@PathVariable Long id) {
        log.debug("REST request to get Province : {}", id);
        Optional<Province> province = provinceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(province);
    }

    /**
     * DELETE  /provinces/:id : delete the "id" province.
     *
     * @param id the id of the province to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/provinces/{id}")
    public ResponseEntity<Void> deleteProvince(@PathVariable Long id) {
        log.debug("REST request to delete Province : {}", id);
        provinceService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

}
