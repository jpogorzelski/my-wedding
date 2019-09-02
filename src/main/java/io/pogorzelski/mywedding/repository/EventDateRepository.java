package io.pogorzelski.mywedding.repository;

import io.pogorzelski.mywedding.domain.EventDate;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the EventDate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventDateRepository extends JpaRepository<EventDate, Long> {

}
