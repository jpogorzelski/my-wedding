package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.Photo;
import io.pogorzelski.mywedding.domain.WeddingHall;
import io.pogorzelski.mywedding.repository.WeddingHallRepository;
import io.pogorzelski.mywedding.repository.search.WeddingHallSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing WeddingHall.
 */
@Service
@Transactional
public class WeddingHallService {

    private final Logger log = LoggerFactory.getLogger(WeddingHallService.class);

    private final WeddingHallRepository weddingHallRepository;

    private final WeddingHallSearchRepository weddingHallSearchRepository;

    public WeddingHallService(WeddingHallRepository weddingHallRepository, WeddingHallSearchRepository weddingHallSearchRepository) {
        this.weddingHallRepository = weddingHallRepository;
        this.weddingHallSearchRepository = weddingHallSearchRepository;
    }

    /**
     * Save a weddingHall.
     *
     * @param weddingHall the entity to save
     * @return the persisted entity
     */
    public WeddingHall save(WeddingHall weddingHall) {
        log.debug("Request to save WeddingHall : {}", weddingHall);
        if (weddingHall.getAlbum() != null && !CollectionUtils.isEmpty(weddingHall.getAlbum().getPhotos())) {
            for (Photo photo : weddingHall.getAlbum().getPhotos()) {
                photo.setAlbum(weddingHall.getAlbum());
            }
        }
        WeddingHall result = weddingHallRepository.save(weddingHall);
        weddingHallSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the weddingHalls.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<WeddingHall> findAll() {
        log.debug("Request to get all WeddingHalls");
        return weddingHallRepository.findAll();
    }


    /**
     * Get one weddingHall by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<WeddingHall> findOne(Long id) {
        log.debug("Request to get WeddingHall : {}", id);
        return weddingHallRepository.findById(id);
    }

    /**
     * Delete the weddingHall by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete WeddingHall : {}", id);
        weddingHallRepository.deleteById(id);
        weddingHallSearchRepository.deleteById(id);
    }

    /**
     * Search for the weddingHall corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<WeddingHall> search(String query) {
        log.debug("Request to search WeddingHalls for query {}", query);
        return StreamSupport
            .stream(weddingHallSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    /**
     * Get wedding halls by company
     *
     * @param company owner of reserved wedding hall
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<WeddingHall> findByCompany(Company company) {
        log.debug("Request to get WeddingHalls by company : {}", company.getId());
        return weddingHallRepository.findByCompany(company);
    }

}
