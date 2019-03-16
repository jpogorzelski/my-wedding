package io.pogorzelski.mywedding.repository;

import io.pogorzelski.mywedding.domain.WeddingHall;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WeddingHall entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeddingHallRepository extends JpaRepository<WeddingHall, Long> {

}
