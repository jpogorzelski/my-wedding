package io.pogorzelski.mywedding.repository;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.WeddingHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the WeddingHall entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeddingHallRepository extends JpaRepository<WeddingHall, Long> {

    List<WeddingHall> findByCompany(Company company);
}
