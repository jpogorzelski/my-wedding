package io.pogorzelski.mywedding.repository;

import java.util.Optional;

import io.pogorzelski.mywedding.domain.Customer;
import io.pogorzelski.mywedding.domain.User;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Customer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findOneByUser(User user);
}
