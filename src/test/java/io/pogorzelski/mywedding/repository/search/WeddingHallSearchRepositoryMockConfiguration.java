package io.pogorzelski.mywedding.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of WeddingHallSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class WeddingHallSearchRepositoryMockConfiguration {

    @MockBean
    private WeddingHallSearchRepository mockWeddingHallSearchRepository;

}
