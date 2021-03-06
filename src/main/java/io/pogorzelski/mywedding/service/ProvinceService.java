package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.Province;
import io.pogorzelski.mywedding.repository.ProvinceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Province.
 */
@Service
@Transactional
public class ProvinceService {

    private final Logger log = LoggerFactory.getLogger(ProvinceService.class);

    private final ProvinceRepository provinceRepository;

    public ProvinceService(ProvinceRepository provinceRepository) {
        this.provinceRepository = provinceRepository;
    }

    /**
     * Save a province.
     *
     * @param province the entity to save
     * @return the persisted entity
     */
    public Province save(Province province) {
        log.debug("Request to save Province : {}", province);
        Province result = provinceRepository.save(province);
        return result;
    }

    /**
     * Get all the provinces.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Province> findAll() {
        log.debug("Request to get all Provinces");
        return provinceRepository.findAll();
    }


    /**
     * Get one province by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Province> findOne(Long id) {
        log.debug("Request to get Province : {}", id);
        return provinceRepository.findById(id);
    }

    /**
     * Delete the province by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Province : {}", id);
        provinceRepository.deleteById(id);
    }

}
