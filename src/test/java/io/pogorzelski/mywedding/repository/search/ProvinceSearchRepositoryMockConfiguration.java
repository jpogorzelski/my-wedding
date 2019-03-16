package io.pogorzelski.mywedding.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of ProvinceSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ProvinceSearchRepositoryMockConfiguration {

    @MockBean
    private ProvinceSearchRepository mockProvinceSearchRepository;

}
