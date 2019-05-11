package io.pogorzelski.mywedding.repository;

import io.pogorzelski.mywedding.domain.ReservationOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


/**
 * Spring Data  repository for the ReservationOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationOrderRepository extends JpaRepository<ReservationOrder, Long> {

    Optional<ReservationOrder> findByOfferId(Long offerId);
}
