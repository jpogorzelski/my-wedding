package io.pogorzelski.mywedding.web.rest;

import io.pogorzelski.mywedding.MyWeddingApp;
import io.pogorzelski.mywedding.domain.Country;
import io.pogorzelski.mywedding.domain.Province;
import io.pogorzelski.mywedding.repository.ProvinceRepository;
import io.pogorzelski.mywedding.service.ProvinceService;
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
import java.util.List;

import static io.pogorzelski.mywedding.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ProvinceResource REST controller.
 *
 * @see ProvinceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MyWeddingApp.class)
public class ProvinceResourceIntTest {

    private static final String DEFAULT_PROVINCE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PROVINCE_NAME = "BBBBBBBBBB";

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private ProvinceService provinceService;

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

    private MockMvc restProvinceMockMvc;

    private Province province;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProvinceResource provinceResource = new ProvinceResource(provinceService);
        this.restProvinceMockMvc = MockMvcBuilders.standaloneSetup(provinceResource)
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
    public static Province createEntity(EntityManager em) {
        Province province = new Province()
            .provinceName(DEFAULT_PROVINCE_NAME);
        // Add required entity
        Country country = CountryResourceIntTest.createEntity(em);
        em.persist(country);
        em.flush();
        province.setCountry(country);
        return province;
    }

    @Before
    public void initTest() {
        province = createEntity(em);
    }

    @Test
    @Transactional
    public void createProvince() throws Exception {
        int databaseSizeBeforeCreate = provinceRepository.findAll().size();

        // Create the Province
        restProvinceMockMvc.perform(post("/api/provinces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(province)))
            .andExpect(status().isCreated());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeCreate + 1);
        Province testProvince = provinceList.get(provinceList.size() - 1);
        assertThat(testProvince.getProvinceName()).isEqualTo(DEFAULT_PROVINCE_NAME);

    }

    @Test
    @Transactional
    public void createProvinceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = provinceRepository.findAll().size();

        // Create the Province with an existing ID
        province.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProvinceMockMvc.perform(post("/api/provinces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(province)))
            .andExpect(status().isBadRequest());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeCreate);

    }

    @Test
    @Transactional
    public void checkProvinceNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = provinceRepository.findAll().size();
        // set the field null
        province.setProvinceName(null);

        // Create the Province, which fails.

        restProvinceMockMvc.perform(post("/api/provinces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(province)))
            .andExpect(status().isBadRequest());

        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProvinces() throws Exception {
        // Initialize the database
        provinceRepository.saveAndFlush(province);

        // Get all the provinceList
        restProvinceMockMvc.perform(get("/api/provinces?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(province.getId().intValue())))
            .andExpect(jsonPath("$.[*].provinceName").value(hasItem(DEFAULT_PROVINCE_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getProvince() throws Exception {
        // Initialize the database
        provinceRepository.saveAndFlush(province);

        // Get the province
        restProvinceMockMvc.perform(get("/api/provinces/{id}", province.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(province.getId().intValue()))
            .andExpect(jsonPath("$.provinceName").value(DEFAULT_PROVINCE_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingProvince() throws Exception {
        // Get the province
        restProvinceMockMvc.perform(get("/api/provinces/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProvince() throws Exception {
        // Initialize the database
        provinceService.save(province);

        int databaseSizeBeforeUpdate = provinceRepository.findAll().size();

        // Update the province
        Province updatedProvince = provinceRepository.findById(province.getId()).get();
        // Disconnect from session so that the updates on updatedProvince are not directly saved in db
        em.detach(updatedProvince);
        updatedProvince
            .provinceName(UPDATED_PROVINCE_NAME);

        restProvinceMockMvc.perform(put("/api/provinces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProvince)))
            .andExpect(status().isOk());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeUpdate);
        Province testProvince = provinceList.get(provinceList.size() - 1);
        assertThat(testProvince.getProvinceName()).isEqualTo(UPDATED_PROVINCE_NAME);

    }

    @Test
    @Transactional
    public void updateNonExistingProvince() throws Exception {
        int databaseSizeBeforeUpdate = provinceRepository.findAll().size();

        // Create the Province

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProvinceMockMvc.perform(put("/api/provinces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(province)))
            .andExpect(status().isBadRequest());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeUpdate);

    }

    @Test
    @Transactional
    public void deleteProvince() throws Exception {
        // Initialize the database
        provinceService.save(province);

        int databaseSizeBeforeDelete = provinceRepository.findAll().size();

        // Delete the province
        restProvinceMockMvc.perform(delete("/api/provinces/{id}", province.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeDelete - 1);

    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Province.class);
        Province province1 = new Province();
        province1.setId(1L);
        Province province2 = new Province();
        province2.setId(province1.getId());
        assertThat(province1).isEqualTo(province2);
        province2.setId(2L);
        assertThat(province1).isNotEqualTo(province2);
        province1.setId(null);
        assertThat(province1).isNotEqualTo(province2);
    }
}
