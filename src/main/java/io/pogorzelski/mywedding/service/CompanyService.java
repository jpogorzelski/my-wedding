package io.pogorzelski.mywedding.service;

import static org.elasticsearch.index.query.QueryBuilders.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.User;
import io.pogorzelski.mywedding.repository.CompanyRepository;
import io.pogorzelski.mywedding.repository.search.CompanySearchRepository;

/**
 * Service Implementation for managing Company.
 */
@Service
@Transactional
public class CompanyService {

    private final Logger log = LoggerFactory.getLogger(CompanyService.class);

    private final CompanyRepository companyRepository;

    private final CompanySearchRepository companySearchRepository;

    public CompanyService(CompanyRepository companyRepository, CompanySearchRepository companySearchRepository) {
        this.companyRepository = companyRepository;
        this.companySearchRepository = companySearchRepository;
    }

    /**
     * Save a company.
     *
     * @param company the entity to save
     * @return the persisted entity
     */
    public Company save(Company company) {
        log.debug("Request to save Company : {}", company);
        return internalSave(company);
    }

    /**
     * Create new company along with user registration.
     *
     * @param user to create company for
     * @return the persisted entity
     */
    public Company registerCompany(User user) {
        log.debug("Request to save User as Company : {}", user.getLogin());
        Company company = new Company();
        company.setOwner(user);
        company.setCompanyName(user.getLogin());
        return internalSave(company);
    }

    private Company internalSave(Company company) {
        Company result = companyRepository.save(company);
        companySearchRepository.save(result);
        return result;
    }

    /**
     * Get all the companies.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Company> findAll() {
        log.debug("Request to get all Companies");
        return companyRepository.findAll();
    }


    /**
     * Get one company by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Company> findOne(Long id) {
        log.debug("Request to get Company : {}", id);
        return companyRepository.findById(id);
    }

    /**
     * Get one company by owner.
     *
     * @param user the user of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Company> findOneByOwner(User user) {
        log.debug("Request to get Company : {}", user.getLogin());
        return companyRepository.findOneByOwner(user);
    }

    /**
     * Delete the company by id.
     *
     * @param user user underlying of company
     */
    public void deleteByUser(User user) {
        log.debug("Request to delete Company with userId : {}", user.getId());
        companyRepository.findOneByOwner(user).ifPresent(company -> {
            Long companyId = company.getId();
            companyRepository.deleteById(companyId);
            companySearchRepository.deleteById(companyId);
            companyRepository.flush();
        });
    }

    /**
     * Delete the company by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Company : {}", id);
        companyRepository.deleteById(id);
        companySearchRepository.deleteById(id);
    }

    /**
     * Search for the company corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Company> search(String query) {
        log.debug("Request to search Companies for query {}", query);
        return StreamSupport
            .stream(companySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
