package io.pogorzelski.mywedding.web.rest;

import io.pogorzelski.mywedding.MyWeddingApp;

import io.pogorzelski.mywedding.domain.WeddingHall;
import io.pogorzelski.mywedding.domain.Country;
import io.pogorzelski.mywedding.domain.Province;
import io.pogorzelski.mywedding.repository.WeddingHallRepository;
import io.pogorzelski.mywedding.repository.search.WeddingHallSearchRepository;
import io.pogorzelski.mywedding.service.WeddingHallService;
import io.pogorzelski.mywedding.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static io.pogorzelski.mywedding.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the WeddingHallResource REST controller.
 *
 * @see WeddingHallResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MyWeddingApp.class)
public class WeddingHallResourceIntTest {

    private static final String DEFAULT_HALL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_HALL_NAME = "BBBBBBBBBB";

    @Autowired
    private WeddingHallRepository weddingHallRepository;

    @Autowired
    private WeddingHallService weddingHallService;

    /**
     * This repository is mocked in the io.pogorzelski.mywedding.repository.search test package.
     *
     * @see io.pogorzelski.mywedding.repository.search.WeddingHallSearchRepositoryMockConfiguration
     */
    @Autowired
    private WeddingHallSearchRepository mockWeddingHallSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restWeddingHallMockMvc;

    private WeddingHall weddingHall;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WeddingHallResource weddingHallResource = new WeddingHallResource(weddingHallService);
        this.restWeddingHallMockMvc = MockMvcBuilders.standaloneSetup(weddingHallResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WeddingHall createEntity(EntityManager em) {
        WeddingHall weddingHall = new WeddingHall()
            .hallName(DEFAULT_HALL_NAME);
        // Add required entity
        Country country = CountryResourceIntTest.createEntity(em);
        em.persist(country);
        em.flush();
        weddingHall.setCountry(country);
        // Add required entity
        Province province = ProvinceResourceIntTest.createEntity(em);
        em.persist(province);
        em.flush();
        weddingHall.setProvince(province);
        return weddingHall;
    }

    @Before
    public void initTest() {
        weddingHall = createEntity(em);
    }

    @Test
    @Transactional
    public void createWeddingHall() throws Exception {
        int databaseSizeBeforeCreate = weddingHallRepository.findAll().size();

        // Create the WeddingHall
        restWeddingHallMockMvc.perform(post("/api/wedding-halls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weddingHall)))
            .andExpect(status().isCreated());

        // Validate the WeddingHall in the database
        List<WeddingHall> weddingHallList = weddingHallRepository.findAll();
        assertThat(weddingHallList).hasSize(databaseSizeBeforeCreate + 1);
        WeddingHall testWeddingHall = weddingHallList.get(weddingHallList.size() - 1);
        assertThat(testWeddingHall.getHallName()).isEqualTo(DEFAULT_HALL_NAME);

        // Validate the WeddingHall in Elasticsearch
        verify(mockWeddingHallSearchRepository, times(1)).save(testWeddingHall);
    }

    @Test
    @Transactional
    public void createWeddingHallWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = weddingHallRepository.findAll().size();

        // Create the WeddingHall with an existing ID
        weddingHall.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeddingHallMockMvc.perform(post("/api/wedding-halls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weddingHall)))
            .andExpect(status().isBadRequest());

        // Validate the WeddingHall in the database
        List<WeddingHall> weddingHallList = weddingHallRepository.findAll();
        assertThat(weddingHallList).hasSize(databaseSizeBeforeCreate);

        // Validate the WeddingHall in Elasticsearch
        verify(mockWeddingHallSearchRepository, times(0)).save(weddingHall);
    }

    @Test
    @Transactional
    public void checkHallNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = weddingHallRepository.findAll().size();
        // set the field null
        weddingHall.setHallName(null);

        // Create the WeddingHall, which fails.

        restWeddingHallMockMvc.perform(post("/api/wedding-halls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weddingHall)))
            .andExpect(status().isBadRequest());

        List<WeddingHall> weddingHallList = weddingHallRepository.findAll();
        assertThat(weddingHallList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllWeddingHalls() throws Exception {
        // Initialize the database
        weddingHallRepository.saveAndFlush(weddingHall);

        // Get all the weddingHallList
        restWeddingHallMockMvc.perform(get("/api/wedding-halls?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weddingHall.getId().intValue())))
            .andExpect(jsonPath("$.[*].hallName").value(hasItem(DEFAULT_HALL_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getWeddingHall() throws Exception {
        // Initialize the database
        weddingHallRepository.saveAndFlush(weddingHall);

        // Get the weddingHall
        restWeddingHallMockMvc.perform(get("/api/wedding-halls/{id}", weddingHall.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(weddingHall.getId().intValue()))
            .andExpect(jsonPath("$.hallName").value(DEFAULT_HALL_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingWeddingHall() throws Exception {
        // Get the weddingHall
        restWeddingHallMockMvc.perform(get("/api/wedding-halls/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWeddingHall() throws Exception {
        // Initialize the database
        weddingHallService.save(weddingHall);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockWeddingHallSearchRepository);

        int databaseSizeBeforeUpdate = weddingHallRepository.findAll().size();

        // Update the weddingHall
        WeddingHall updatedWeddingHall = weddingHallRepository.findById(weddingHall.getId()).get();
        // Disconnect from session so that the updates on updatedWeddingHall are not directly saved in db
        em.detach(updatedWeddingHall);
        updatedWeddingHall
            .hallName(UPDATED_HALL_NAME);

        restWeddingHallMockMvc.perform(put("/api/wedding-halls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWeddingHall)))
            .andExpect(status().isOk());

        // Validate the WeddingHall in the database
        List<WeddingHall> weddingHallList = weddingHallRepository.findAll();
        assertThat(weddingHallList).hasSize(databaseSizeBeforeUpdate);
        WeddingHall testWeddingHall = weddingHallList.get(weddingHallList.size() - 1);
        assertThat(testWeddingHall.getHallName()).isEqualTo(UPDATED_HALL_NAME);

        // Validate the WeddingHall in Elasticsearch
        verify(mockWeddingHallSearchRepository, times(1)).save(testWeddingHall);
    }

    @Test
    @Transactional
    public void updateNonExistingWeddingHall() throws Exception {
        int databaseSizeBeforeUpdate = weddingHallRepository.findAll().size();

        // Create the WeddingHall

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeddingHallMockMvc.perform(put("/api/wedding-halls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weddingHall)))
            .andExpect(status().isBadRequest());

        // Validate the WeddingHall in the database
        List<WeddingHall> weddingHallList = weddingHallRepository.findAll();
        assertThat(weddingHallList).hasSize(databaseSizeBeforeUpdate);

        // Validate the WeddingHall in Elasticsearch
        verify(mockWeddingHallSearchRepository, times(0)).save(weddingHall);
    }

    @Test
    @Transactional
    public void deleteWeddingHall() throws Exception {
        // Initialize the database
        weddingHallService.save(weddingHall);

        int databaseSizeBeforeDelete = weddingHallRepository.findAll().size();

        // Delete the weddingHall
        restWeddingHallMockMvc.perform(delete("/api/wedding-halls/{id}", weddingHall.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<WeddingHall> weddingHallList = weddingHallRepository.findAll();
        assertThat(weddingHallList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the WeddingHall in Elasticsearch
        verify(mockWeddingHallSearchRepository, times(1)).deleteById(weddingHall.getId());
    }

    @Test
    @Transactional
    public void searchWeddingHall() throws Exception {
        // Initialize the database
        weddingHallService.save(weddingHall);
        when(mockWeddingHallSearchRepository.search(queryStringQuery("id:" + weddingHall.getId())))
            .thenReturn(Collections.singletonList(weddingHall));
        // Search the weddingHall
        restWeddingHallMockMvc.perform(get("/api/_search/wedding-halls?query=id:" + weddingHall.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weddingHall.getId().intValue())))
            .andExpect(jsonPath("$.[*].hallName").value(hasItem(DEFAULT_HALL_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WeddingHall.class);
        WeddingHall weddingHall1 = new WeddingHall();
        weddingHall1.setId(1L);
        WeddingHall weddingHall2 = new WeddingHall();
        weddingHall2.setId(weddingHall1.getId());
        assertThat(weddingHall1).isEqualTo(weddingHall2);
        weddingHall2.setId(2L);
        assertThat(weddingHall1).isNotEqualTo(weddingHall2);
        weddingHall1.setId(null);
        assertThat(weddingHall1).isNotEqualTo(weddingHall2);
    }
}
