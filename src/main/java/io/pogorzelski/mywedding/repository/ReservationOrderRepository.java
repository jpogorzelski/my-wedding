package io.pogorzelski.mywedding.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.Customer;
import io.pogorzelski.mywedding.domain.ReservationOrder;


/**
 * Spring Data  repository for the ReservationOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationOrderRepository extends JpaRepository<ReservationOrder, Long> {

    Optional<ReservationOrder> findByOfferId(Long offerId);

    List<ReservationOrder> findByCustomer(Customer customer);

    List<ReservationOrder> findByOffer_WeddingHall_Company(Company company);
}
