package io.pogorzelski.mywedding.repository;

import java.util.Optional;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.User;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Company entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findOneByOwner(User owner);

}
