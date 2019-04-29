package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.Customer;
import io.pogorzelski.mywedding.domain.User;
import io.pogorzelski.mywedding.repository.CustomerRepository;
import io.pogorzelski.mywedding.repository.search.CustomerSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Customer.
 */
@Service
@Transactional
public class CustomerService {

    private final Logger log = LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;

    private final CustomerSearchRepository customerSearchRepository;

    public CustomerService(CustomerRepository customerRepository, CustomerSearchRepository customerSearchRepository) {
        this.customerRepository = customerRepository;
        this.customerSearchRepository = customerSearchRepository;
    }

    /**
     * Save a customer.
     *
     * @param customer the entity to save
     * @return the persisted entity
     */
    public Customer save(Customer customer) {
        log.debug("Request to save Customer : {}", customer);
        return internalSave(customer);
    }

    /**
     * Save a customer.
     *
     * @param user to create customer for
     * @return the persisted entity
     */
    public Customer registerCustomer(User user) {
        log.debug("Request to save User as Customer : {}", user.getLogin());
        Customer customer = new Customer();
        customer.setUser(user);
        return internalSave(customer);
    }

    private Customer internalSave(Customer customer) {
        Customer result = customerRepository.save(customer);
        customerSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the customers.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Customer> findAll() {
        log.debug("Request to get all Customers");
        return customerRepository.findAll();
    }


    /**
     * Get one customer by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Customer> findOne(Long id) {
        log.debug("Request to get Customer : {}", id);
        return customerRepository.findById(id);
    }
    /**
     * Get one customer by user.
     *
     * @param user the user of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Customer> findOneByUser(User user) {
        log.debug("Request to get Customer : {}", user.getLogin());
        return customerRepository.findOneByUser(user);
    }

    /**
     * Delete the customer by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Customer : {}", id);
        customerRepository.deleteById(id);
        customerSearchRepository.deleteById(id);
    }

    /**
     * Delete the customer by id.
     *
     * @param user user underlying of customer
     */
    public void deleteByUser(User user) {
        log.debug("Request to delete Customer with userId : {}", user.getId());
        customerRepository.findOneByUser(user).ifPresent(customer -> {
            Long customerId = customer.getId();
            customerRepository.deleteById(customerId);
            customerSearchRepository.deleteById(customerId);
            customerRepository.flush();
        });
    }

    /**
     * Search for the customer corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Customer> search(String query) {
        log.debug("Request to search Customers for query {}", query);
        return StreamSupport
            .stream(customerSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
