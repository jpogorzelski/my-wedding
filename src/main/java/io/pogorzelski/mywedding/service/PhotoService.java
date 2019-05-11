package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.Photo;
import io.pogorzelski.mywedding.repository.PhotoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Photo.
 */
@Service
@Transactional
public class PhotoService {

    private final Logger log = LoggerFactory.getLogger(PhotoService.class);

    private final PhotoRepository photoRepository;

    private final Clock clock;

    public PhotoService(PhotoRepository photoRepository, Clock clock) {
        this.photoRepository = photoRepository;
        this.clock = clock;
    }

    /**
     * Save a photo.
     *
     * @param photo the entity to save
     * @return the persisted entity
     */
    public Photo save(Photo photo) {
        log.debug("Request to save Photo : {}", photo);
        if (photo.getId() == null) {
            photo.setUploaded(Instant.now(clock));
        } else {
            Photo oldEntity = photoRepository.getOne(photo.getId());
            photo.setUploaded(oldEntity.getUploaded());
        }
        return photoRepository.save(photo);
    }

    /**
     * Get all the photos.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Photo> findAll() {
        log.debug("Request to get all Photos");
        return photoRepository.findAll();
    }


    /**
     * Get one photo by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Photo> findOne(Long id) {
        log.debug("Request to get Photo : {}", id);
        return photoRepository.findById(id);
    }

    /**
     * Delete the photo by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Photo : {}", id);
        photoRepository.deleteById(id);
    }
}
