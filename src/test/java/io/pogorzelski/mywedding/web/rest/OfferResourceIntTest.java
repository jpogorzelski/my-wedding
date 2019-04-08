package io.pogorzelski.mywedding.web.rest;

import io.pogorzelski.mywedding.MyWeddingApp;

import io.pogorzelski.mywedding.domain.Offer;
import io.pogorzelski.mywedding.domain.WeddingHall;
import io.pogorzelski.mywedding.repository.OfferRepository;
import io.pogorzelski.mywedding.service.OfferService;
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
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static io.pogorzelski.mywedding.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the OfferResource REST controller.
 *
 * @see OfferResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MyWeddingApp.class)
public class OfferResourceIntTest {

    private static final Instant DEFAULT_EVENT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EVENT_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRICE_PER_CAPITA = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE_PER_CAPITA = new BigDecimal(2);

    private static final Boolean DEFAULT_AVAILABLE = false;
    private static final Boolean UPDATED_AVAILABLE = true;

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private OfferService offerService;

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

    private MockMvc restOfferMockMvc;

    private Offer offer;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OfferResource offerResource = new OfferResource(offerService);
        this.restOfferMockMvc = MockMvcBuilders.standaloneSetup(offerResource)
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
    public static Offer createEntity(EntityManager em) {
        Offer offer = new Offer()
            .eventDate(DEFAULT_EVENT_DATE)
            .description(DEFAULT_DESCRIPTION)
            .pricePerCapita(DEFAULT_PRICE_PER_CAPITA)
            .available(DEFAULT_AVAILABLE)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE);
        // Add required entity
        WeddingHall weddingHall = WeddingHallResourceIntTest.createEntity(em);
        em.persist(weddingHall);
        em.flush();
        offer.setWeddingHall(weddingHall);
        return offer;
    }

    @Before
    public void initTest() {
        offer = createEntity(em);
    }

    @Test
    @Transactional
    public void createOffer() throws Exception {
        int databaseSizeBeforeCreate = offerRepository.findAll().size();

        // Create the Offer
        restOfferMockMvc.perform(post("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offer)))
            .andExpect(status().isCreated());

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeCreate + 1);
        Offer testOffer = offerList.get(offerList.size() - 1);
        assertThat(testOffer.getEventDate()).isEqualTo(DEFAULT_EVENT_DATE);
        assertThat(testOffer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testOffer.getPricePerCapita()).isEqualTo(DEFAULT_PRICE_PER_CAPITA);
        assertThat(testOffer.isAvailable()).isEqualTo(DEFAULT_AVAILABLE);
        assertThat(testOffer.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testOffer.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    public void createOfferWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = offerRepository.findAll().size();

        // Create the Offer with an existing ID
        offer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOfferMockMvc.perform(post("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offer)))
            .andExpect(status().isBadRequest());

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkEventDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = offerRepository.findAll().size();
        // set the field null
        offer.setEventDate(null);

        // Create the Offer, which fails.

        restOfferMockMvc.perform(post("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offer)))
            .andExpect(status().isBadRequest());

        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPricePerCapitaIsRequired() throws Exception {
        int databaseSizeBeforeTest = offerRepository.findAll().size();
        // set the field null
        offer.setPricePerCapita(null);

        // Create the Offer, which fails.

        restOfferMockMvc.perform(post("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offer)))
            .andExpect(status().isBadRequest());

        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAvailableIsRequired() throws Exception {
        int databaseSizeBeforeTest = offerRepository.findAll().size();
        // set the field null
        offer.setAvailable(null);

        // Create the Offer, which fails.

        restOfferMockMvc.perform(post("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offer)))
            .andExpect(status().isBadRequest());

        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = offerRepository.findAll().size();
        // set the field null
        offer.setStartDate(null);

        // Create the Offer, which fails.

        restOfferMockMvc.perform(post("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offer)))
            .andExpect(status().isBadRequest());

        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOffers() throws Exception {
        // Initialize the database
        offerRepository.saveAndFlush(offer);

        // Get all the offerList
        restOfferMockMvc.perform(get("/api/offers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offer.getId().intValue())))
            .andExpect(jsonPath("$.[*].eventDate").value(hasItem(DEFAULT_EVENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].pricePerCapita").value(hasItem(DEFAULT_PRICE_PER_CAPITA.intValue())))
            .andExpect(jsonPath("$.[*].available").value(hasItem(DEFAULT_AVAILABLE.booleanValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getOffer() throws Exception {
        // Initialize the database
        offerRepository.saveAndFlush(offer);

        // Get the offer
        restOfferMockMvc.perform(get("/api/offers/{id}", offer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(offer.getId().intValue()))
            .andExpect(jsonPath("$.eventDate").value(DEFAULT_EVENT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.pricePerCapita").value(DEFAULT_PRICE_PER_CAPITA.intValue()))
            .andExpect(jsonPath("$.available").value(DEFAULT_AVAILABLE.booleanValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOffer() throws Exception {
        // Get the offer
        restOfferMockMvc.perform(get("/api/offers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOffer() throws Exception {
        // Initialize the database
        offerService.save(offer);

        int databaseSizeBeforeUpdate = offerRepository.findAll().size();

        // Update the offer
        Offer updatedOffer = offerRepository.findById(offer.getId()).get();
        // Disconnect from session so that the updates on updatedOffer are not directly saved in db
        em.detach(updatedOffer);
        updatedOffer
            .eventDate(UPDATED_EVENT_DATE)
            .description(UPDATED_DESCRIPTION)
            .pricePerCapita(UPDATED_PRICE_PER_CAPITA)
            .available(UPDATED_AVAILABLE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restOfferMockMvc.perform(put("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOffer)))
            .andExpect(status().isOk());

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
        Offer testOffer = offerList.get(offerList.size() - 1);
        assertThat(testOffer.getEventDate()).isEqualTo(UPDATED_EVENT_DATE);
        assertThat(testOffer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOffer.getPricePerCapita()).isEqualTo(UPDATED_PRICE_PER_CAPITA);
        assertThat(testOffer.isAvailable()).isEqualTo(UPDATED_AVAILABLE);
        assertThat(testOffer.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testOffer.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingOffer() throws Exception {
        int databaseSizeBeforeUpdate = offerRepository.findAll().size();

        // Create the Offer

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfferMockMvc.perform(put("/api/offers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offer)))
            .andExpect(status().isBadRequest());

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOffer() throws Exception {
        // Initialize the database
        offerService.save(offer);

        int databaseSizeBeforeDelete = offerRepository.findAll().size();

        // Delete the offer
        restOfferMockMvc.perform(delete("/api/offers/{id}", offer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Offer> offerList = offerRepository.findAll();
        assertThat(offerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Offer.class);
        Offer offer1 = new Offer();
        offer1.setId(1L);
        Offer offer2 = new Offer();
        offer2.setId(offer1.getId());
        assertThat(offer1).isEqualTo(offer2);
        offer2.setId(2L);
        assertThat(offer1).isNotEqualTo(offer2);
        offer1.setId(null);
        assertThat(offer1).isNotEqualTo(offer2);
    }
}
