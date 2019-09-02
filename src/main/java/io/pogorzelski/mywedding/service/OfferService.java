package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.Offer;
import io.pogorzelski.mywedding.domain.Photo;
import io.pogorzelski.mywedding.repository.OfferRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Service Implementation for managing Offer.
 */
@Service
@Transactional
public class OfferService {

    private final Logger log = LoggerFactory.getLogger(OfferService.class);

    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    /**
     * Save a offer.
     *
     * @param offer the entity to save
     * @return the persisted entity
     */
    public Offer save(Offer offer) {
        log.debug("Request to save Offer : {}", offer);
        if (offer.getAlbum() != null && !CollectionUtils.isEmpty(offer.getAlbum().getPhotos())) {
            for (Photo photo : offer.getAlbum().getPhotos()) {
                photo.setAlbum(offer.getAlbum());
            }
        }
        return offerRepository.save(offer);
    }

    /**
     * Get all the offers.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Offer> findAll() {
        log.debug("Request to get all Offers");
        return offerRepository.findAll();
    }



    /**
     *  get all the offers where ReservationOrder is null.
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Offer> findAllWhereReservationOrderIsNull() {
        log.debug("Request to get all offers where ReservationOrder is null");
        return StreamSupport
            .stream(offerRepository.findAll().spliterator(), false)
            .filter(offer -> offer.getReservationOrder() == null)
            .collect(Collectors.toList());
    }

    /**
     * Get one offer by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Offer> findOne(Long id) {
        log.debug("Request to get Offer : {}", id);
        return offerRepository.findById(id);
    }

    /**
     * Delete the offer by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Offer : {}", id);
        offerRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Offer> findByCompany(Company company) {
        log.debug("Request to get all Offers for company: {}", company);
        return offerRepository.findByWeddingHall_Company(company);
    }
}
