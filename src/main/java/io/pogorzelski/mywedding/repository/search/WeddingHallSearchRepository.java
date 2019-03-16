package io.pogorzelski.mywedding.repository.search;

import io.pogorzelski.mywedding.domain.WeddingHall;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the WeddingHall entity.
 */
public interface WeddingHallSearchRepository extends ElasticsearchRepository<WeddingHall, Long> {
}
