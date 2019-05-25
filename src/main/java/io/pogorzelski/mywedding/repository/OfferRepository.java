package io.pogorzelski.mywedding.repository;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Offer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findByWeddingHall_Company(Company company);
}
