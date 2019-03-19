package io.pogorzelski.mywedding.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.Customer;
import io.pogorzelski.mywedding.domain.User;
import io.pogorzelski.mywedding.domain.WeddingHall;
import io.pogorzelski.mywedding.repository.CompanyRepository;
import io.pogorzelski.mywedding.repository.CustomerRepository;
import io.pogorzelski.mywedding.repository.UserRepository;
import io.pogorzelski.mywedding.repository.WeddingHallRepository;
import io.pogorzelski.mywedding.repository.search.CompanySearchRepository;
import io.pogorzelski.mywedding.repository.search.CustomerSearchRepository;
import io.pogorzelski.mywedding.repository.search.UserSearchRepository;
import io.pogorzelski.mywedding.repository.search.WeddingHallSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.ManyToMany;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ElasticsearchIndexService {

    private static final Lock reindexLock = new ReentrantLock();

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final CompanyRepository companyRepository;

    private final CompanySearchRepository companySearchRepository;

    private final CustomerRepository customerRepository;

    private final CustomerSearchRepository customerSearchRepository;

    private final WeddingHallRepository weddingHallRepository;

    private final WeddingHallSearchRepository weddingHallSearchRepository;

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final ElasticsearchOperations elasticsearchTemplate;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        CompanyRepository companyRepository,
        CompanySearchRepository companySearchRepository,
        CustomerRepository customerRepository,
        CustomerSearchRepository customerSearchRepository,
        WeddingHallRepository weddingHallRepository,
        WeddingHallSearchRepository weddingHallSearchRepository,
        ElasticsearchOperations elasticsearchTemplate) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.companyRepository = companyRepository;
        this.companySearchRepository = companySearchRepository;
        this.customerRepository = customerRepository;
        this.customerSearchRepository = customerSearchRepository;
        this.weddingHallRepository = weddingHallRepository;
        this.weddingHallSearchRepository = weddingHallSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Async
    public void reindexAll() {
        if (reindexLock.tryLock()) {
            try {
                reindexForClass(Company.class, companyRepository, companySearchRepository);
                reindexForClass(Customer.class, customerRepository, customerSearchRepository);
                reindexForClass(WeddingHall.class, weddingHallRepository, weddingHallSearchRepository);
                reindexForClass(User.class, userRepository, userSearchRepository);

                log.info("Elasticsearch: Successfully performed reindexing");
            } finally {
                reindexLock.unlock();
            }
        } else {
            log.info("Elasticsearch: concurrent reindexing attempt");
        }
    }

    private <T, ID extends Serializable> void reindexForClass(Class<T> entityClass, JpaRepository<T, ID> jpaRepository,
                                                              ElasticsearchRepository<T, ID> elasticsearchRepository) {
        elasticsearchTemplate.deleteIndex(entityClass);
        elasticsearchTemplate.createIndex(entityClass);
        elasticsearchTemplate.putMapping(entityClass);
        if (jpaRepository.count() > 0) {
            // if a JHipster entity field is the owner side of a many-to-many relationship, it should be loaded manually
            List<Method> relationshipGetters = Arrays.stream(entityClass.getDeclaredFields())
                .filter(field -> field.getType().equals(Set.class))
                .filter(field -> field.getAnnotation(ManyToMany.class) != null)
                .filter(field -> field.getAnnotation(ManyToMany.class).mappedBy().isEmpty())
                .filter(field -> field.getAnnotation(JsonIgnore.class) == null)
                .map(field -> {
                    try {
                        return new PropertyDescriptor(field.getName(), entityClass).getReadMethod();
                    } catch (IntrospectionException e) {
                        log.error("Error retrieving getter for class {}, field {}. Field will NOT be indexed",
                            entityClass.getSimpleName(), field.getName(), e);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            int size = 100;
            for (int i = 0; i <= jpaRepository.count() / size; i++) {
                Pageable page = PageRequest.of(i, size);
                log.info("Indexing page {} of {}, size {}", i, jpaRepository.count() / size, size);
                Page<T> results = jpaRepository.findAll(page);
                results.map(result -> {
                    // if there are any relationships to load, do it now
                    relationshipGetters.forEach(method -> {
                        try {
                            // eagerly load the relationship set
                            ((Set) method.invoke(result)).size();
                        } catch (Exception ex) {
                            log.error(ex.getMessage());
                        }
                    });
                    return result;
                });
                elasticsearchRepository.saveAll(results.getContent());
            }
        }
        log.info("Elasticsearch: Indexed all rows for {}", entityClass.getSimpleName());
    }
}
