package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.Album;
import io.pogorzelski.mywedding.repository.AlbumRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Album.
 */
@Service
@Transactional
public class AlbumService {

    private final Logger log = LoggerFactory.getLogger(AlbumService.class);

    private final AlbumRepository albumRepository;

    private final Clock clock;

    public AlbumService(AlbumRepository albumRepository, Clock clock) {
        this.albumRepository = albumRepository;
        this.clock = clock;
    }

    /**
     * Save a album.
     *
     * @param album the entity to save
     * @return the persisted entity
     */
    public Album save(Album album) {
        log.debug("Request to save Album : {}", album);
        final Instant now = Instant.now(clock);
        album.setCreated(now);
        return albumRepository.save(album);
    }

    /**
     * Get all the albums.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Album> findAll() {
        log.debug("Request to get all Albums");
        return albumRepository.findAll();
    }


    /**
     * Get one album by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Album> findOne(Long id) {
        log.debug("Request to get Album : {}", id);
        return albumRepository.findById(id);
    }

    /**
     * Delete the album by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Album : {}", id);
        albumRepository.deleteById(id);
    }
}
