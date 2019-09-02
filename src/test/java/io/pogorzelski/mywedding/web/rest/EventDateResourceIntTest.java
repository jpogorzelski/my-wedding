package io.pogorzelski.mywedding.web.rest;

import io.pogorzelski.mywedding.MyWeddingApp;

import io.pogorzelski.mywedding.domain.EventDate;
import io.pogorzelski.mywedding.repository.EventDateRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static io.pogorzelski.mywedding.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EventDateResource REST controller.
 *
 * @see EventDateResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MyWeddingApp.class)
public class EventDateResourceIntTest {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private EventDateRepository eventDateRepository;

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

    private MockMvc restEventDateMockMvc;

    private EventDate eventDate;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventDateResource eventDateResource = new EventDateResource(eventDateRepository);
        this.restEventDateMockMvc = MockMvcBuilders.standaloneSetup(eventDateResource)
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
    public static EventDate createEntity(EntityManager em) {
        EventDate eventDate = new EventDate()
            .date(DEFAULT_DATE);
        return eventDate;
    }

    @Before
    public void initTest() {
        eventDate = createEntity(em);
    }

    @Test
    @Transactional
    public void createEventDate() throws Exception {
        int databaseSizeBeforeCreate = eventDateRepository.findAll().size();

        // Create the EventDate
        restEventDateMockMvc.perform(post("/api/event-dates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventDate)))
            .andExpect(status().isCreated());

        // Validate the EventDate in the database
        List<EventDate> eventDateList = eventDateRepository.findAll();
        assertThat(eventDateList).hasSize(databaseSizeBeforeCreate + 1);
        EventDate testEventDate = eventDateList.get(eventDateList.size() - 1);
        assertThat(testEventDate.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createEventDateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventDateRepository.findAll().size();

        // Create the EventDate with an existing ID
        eventDate.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventDateMockMvc.perform(post("/api/event-dates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventDate)))
            .andExpect(status().isBadRequest());

        // Validate the EventDate in the database
        List<EventDate> eventDateList = eventDateRepository.findAll();
        assertThat(eventDateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventDateRepository.findAll().size();
        // set the field null
        eventDate.setDate(null);

        // Create the EventDate, which fails.

        restEventDateMockMvc.perform(post("/api/event-dates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventDate)))
            .andExpect(status().isBadRequest());

        List<EventDate> eventDateList = eventDateRepository.findAll();
        assertThat(eventDateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEventDates() throws Exception {
        // Initialize the database
        eventDateRepository.saveAndFlush(eventDate);

        // Get all the eventDateList
        restEventDateMockMvc.perform(get("/api/event-dates?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventDate.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getEventDate() throws Exception {
        // Initialize the database
        eventDateRepository.saveAndFlush(eventDate);

        // Get the eventDate
        restEventDateMockMvc.perform(get("/api/event-dates/{id}", eventDate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventDate.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEventDate() throws Exception {
        // Get the eventDate
        restEventDateMockMvc.perform(get("/api/event-dates/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventDate() throws Exception {
        // Initialize the database
        eventDateRepository.saveAndFlush(eventDate);

        int databaseSizeBeforeUpdate = eventDateRepository.findAll().size();

        // Update the eventDate
        EventDate updatedEventDate = eventDateRepository.findById(eventDate.getId()).get();
        // Disconnect from session so that the updates on updatedEventDate are not directly saved in db
        em.detach(updatedEventDate);
        updatedEventDate
            .date(UPDATED_DATE);

        restEventDateMockMvc.perform(put("/api/event-dates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventDate)))
            .andExpect(status().isOk());

        // Validate the EventDate in the database
        List<EventDate> eventDateList = eventDateRepository.findAll();
        assertThat(eventDateList).hasSize(databaseSizeBeforeUpdate);
        EventDate testEventDate = eventDateList.get(eventDateList.size() - 1);
        assertThat(testEventDate.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingEventDate() throws Exception {
        int databaseSizeBeforeUpdate = eventDateRepository.findAll().size();

        // Create the EventDate

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventDateMockMvc.perform(put("/api/event-dates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventDate)))
            .andExpect(status().isBadRequest());

        // Validate the EventDate in the database
        List<EventDate> eventDateList = eventDateRepository.findAll();
        assertThat(eventDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEventDate() throws Exception {
        // Initialize the database
        eventDateRepository.saveAndFlush(eventDate);

        int databaseSizeBeforeDelete = eventDateRepository.findAll().size();

        // Delete the eventDate
        restEventDateMockMvc.perform(delete("/api/event-dates/{id}", eventDate.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EventDate> eventDateList = eventDateRepository.findAll();
        assertThat(eventDateList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventDate.class);
        EventDate eventDate1 = new EventDate();
        eventDate1.setId(1L);
        EventDate eventDate2 = new EventDate();
        eventDate2.setId(eventDate1.getId());
        assertThat(eventDate1).isEqualTo(eventDate2);
        eventDate2.setId(2L);
        assertThat(eventDate1).isNotEqualTo(eventDate2);
        eventDate1.setId(null);
        assertThat(eventDate1).isNotEqualTo(eventDate2);
    }
}
