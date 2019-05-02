package io.pogorzelski.mywedding.web.rest;

import io.pogorzelski.mywedding.MyWeddingApp;
import io.pogorzelski.mywedding.domain.Customer;
import io.pogorzelski.mywedding.domain.Offer;
import io.pogorzelski.mywedding.domain.ReservationOrder;
import io.pogorzelski.mywedding.repository.CustomerRepository;
import io.pogorzelski.mywedding.repository.ReservationOrderRepository;
import io.pogorzelski.mywedding.service.CustomerService;
import io.pogorzelski.mywedding.service.ReservationOrderService;
import io.pogorzelski.mywedding.service.UserService;
import io.pogorzelski.mywedding.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static io.pogorzelski.mywedding.web.rest.TestUtil.createFormattingConversionService;
import static java.time.ZoneOffset.UTC;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ReservationOrderResource REST controller.
 *
 * @see ReservationOrderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MyWeddingApp.class)
@WithUserDetails
public class ReservationOrderResourceIntTest {

    private static final Boolean DEFAULT_RESERVATION_CONFIRMED = false;
    private static final Boolean UPDATED_RESERVATION_CONFIRMED = true;

    private static final Integer DEFAULT_GUEST_COUNT = 1;
    private static final Integer UPDATED_GUEST_COUNT = 2;

    private static final BigDecimal DEFAULT_DOWN_PAYMENT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_DOWN_PAYMENT_AMOUNT = new BigDecimal(2);

    private static final Boolean DEFAULT_DOWN_PAYMENT_SETTLED = false;
    private static final Boolean UPDATED_DOWN_PAYMENT_SETTLED = true;

    private static final Instant EXPECTED_CREATED = Instant.EPOCH;
    private static final LocalDate DEFAULT_CREATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATE_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate EXPECTED_CREATE_DATE =  LocalDateTime.ofInstant(EXPECTED_CREATED, ZoneOffset.UTC).toLocalDate();

    private static final Instant EXPECTED_UPDATED = Instant.EPOCH.plus(2, ChronoUnit.DAYS);
    private static final LocalDate DEFAULT_MODIFICATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MODIFICATION_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate EXPECTED_MODIFICATION_DATE =  LocalDateTime.ofInstant(EXPECTED_UPDATED, ZoneOffset.UTC).toLocalDate();

    @Autowired
    private ReservationOrderRepository reservationOrderRepository;

    private ReservationOrderService reservationOrderService;

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private UserService userService;

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

    private MockMvc restReservationOrderMockMvc;

    private ReservationOrder reservationOrder;

    @Mock
    private Clock clock;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.reservationOrderService = new ReservationOrderService(reservationOrderRepository, userService, customerRepository, clock);
        final ReservationOrderResource reservationOrderResource = new ReservationOrderResource(reservationOrderService);
        doReturn(EXPECTED_CREATED).when(clock).instant();
        doReturn(UTC).when(clock).getZone();
        this.restReservationOrderMockMvc = MockMvcBuilders.standaloneSetup(reservationOrderResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
        userService.getUserWithAuthorities().ifPresent(customerService::registerCustomer);
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReservationOrder createEntity(EntityManager em) {
        ReservationOrder reservationOrder = new ReservationOrder()
            .reservationConfirmed(DEFAULT_RESERVATION_CONFIRMED)
            .guestCount(DEFAULT_GUEST_COUNT)
            .downPaymentAmount(DEFAULT_DOWN_PAYMENT_AMOUNT)
            .downPaymentSettled(DEFAULT_DOWN_PAYMENT_SETTLED)
            .createDate(DEFAULT_CREATE_DATE)
            .modificationDate(DEFAULT_MODIFICATION_DATE);
        // Add required entity
        Offer offer = OfferResourceIntTest.createEntity(em);
        em.persist(offer);
        em.flush();
        reservationOrder.setOffer(offer);
        // Add required entity
        Customer customer = CustomerResourceIntTest.createEntity(em);
        em.persist(customer);
        em.flush();
        reservationOrder.setCustomer(customer);
        return reservationOrder;
    }

    @Before
    public void initTest() {
        reservationOrder = createEntity(em);
    }

    @Test
    @Transactional
    public void createReservationOrder() throws Exception {
        int databaseSizeBeforeCreate = reservationOrderRepository.findAll().size();

        // Create the ReservationOrder
        restReservationOrderMockMvc.perform(post("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isCreated());

        // Validate the ReservationOrder in the database
        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeCreate + 1);
        ReservationOrder testReservationOrder = reservationOrderList.get(reservationOrderList.size() - 1);
        assertThat(testReservationOrder.isReservationConfirmed()).isEqualTo(DEFAULT_RESERVATION_CONFIRMED);
        assertThat(testReservationOrder.getGuestCount()).isEqualTo(DEFAULT_GUEST_COUNT);
        assertThat(testReservationOrder.getDownPaymentAmount()).isEqualTo(DEFAULT_DOWN_PAYMENT_AMOUNT);
        assertThat(testReservationOrder.isDownPaymentSettled()).isEqualTo(DEFAULT_DOWN_PAYMENT_SETTLED);
        assertThat(testReservationOrder.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testReservationOrder.getModificationDate()).isEqualTo(DEFAULT_MODIFICATION_DATE);
    }

    @Test
    @Transactional
    @WithAnonymousUser
    public void createReservationOrderNotLoggedIn() throws Exception {

        // Create the ReservationOrder
        restReservationOrderMockMvc.perform(post("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    public void createReservationOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = reservationOrderRepository.findAll().size();

        // Create the ReservationOrder with an existing ID
        reservationOrder.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restReservationOrderMockMvc.perform(post("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ReservationOrder in the database
        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkGuestCountIsRequired() throws Exception {
        int databaseSizeBeforeTest = reservationOrderRepository.findAll().size();
        // set the field null
        reservationOrder.setGuestCount(null);

        // Create the ReservationOrder, which fails.

        restReservationOrderMockMvc.perform(post("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isBadRequest());

        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDownPaymentAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = reservationOrderRepository.findAll().size();
        // set the field null
        reservationOrder.setDownPaymentAmount(null);

        // Create the ReservationOrder, which fails.

        restReservationOrderMockMvc.perform(post("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isBadRequest());

        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreateDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = reservationOrderRepository.findAll().size();
        // set the field null
        reservationOrder.setCreateDate(null);

        // Create the ReservationOrder, which fails.

        restReservationOrderMockMvc.perform(post("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isBadRequest());

        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkModificationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = reservationOrderRepository.findAll().size();
        // set the field null
        reservationOrder.setModificationDate(null);

        // Create the ReservationOrder, which fails.

        restReservationOrderMockMvc.perform(post("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isBadRequest());

        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllReservationOrders() throws Exception {
        // Initialize the database
        reservationOrderRepository.saveAndFlush(reservationOrder);

        // Get all the reservationOrderList
        restReservationOrderMockMvc.perform(get("/api/reservation-orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reservationOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].reservationConfirmed").value(hasItem(DEFAULT_RESERVATION_CONFIRMED.booleanValue())))
            .andExpect(jsonPath("$.[*].guestCount").value(hasItem(DEFAULT_GUEST_COUNT)))
            .andExpect(jsonPath("$.[*].downPaymentAmount").value(hasItem(DEFAULT_DOWN_PAYMENT_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].downPaymentSettled").value(hasItem(DEFAULT_DOWN_PAYMENT_SETTLED.booleanValue())))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(DEFAULT_CREATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].modificationDate").value(hasItem(DEFAULT_MODIFICATION_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getReservationOrder() throws Exception {
        // Initialize the database
        reservationOrderRepository.saveAndFlush(reservationOrder);

        // Get the reservationOrder
        restReservationOrderMockMvc.perform(get("/api/reservation-orders/{id}", reservationOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(reservationOrder.getId().intValue()))
            .andExpect(jsonPath("$.reservationConfirmed").value(DEFAULT_RESERVATION_CONFIRMED.booleanValue()))
            .andExpect(jsonPath("$.guestCount").value(DEFAULT_GUEST_COUNT))
            .andExpect(jsonPath("$.downPaymentAmount").value(DEFAULT_DOWN_PAYMENT_AMOUNT.intValue()))
            .andExpect(jsonPath("$.downPaymentSettled").value(DEFAULT_DOWN_PAYMENT_SETTLED.booleanValue()))
            .andExpect(jsonPath("$.createDate").value(DEFAULT_CREATE_DATE.toString()))
            .andExpect(jsonPath("$.modificationDate").value(DEFAULT_MODIFICATION_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingReservationOrder() throws Exception {
        // Get the reservationOrder
        restReservationOrderMockMvc.perform(get("/api/reservation-orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateReservationOrder() throws Exception {

        doReturn(EXPECTED_UPDATED).when(clock).instant();
        // Initialize the database
        reservationOrderRepository.save(reservationOrder);

        int databaseSizeBeforeUpdate = reservationOrderRepository.findAll().size();

        // Update the reservationOrder
        ReservationOrder updatedReservationOrder = reservationOrderRepository.findById(reservationOrder.getId()).get();
        // Disconnect from session so that the updates on updatedReservationOrder are not directly saved in db
        em.detach(updatedReservationOrder);
        updatedReservationOrder
            .reservationConfirmed(UPDATED_RESERVATION_CONFIRMED)
            .guestCount(UPDATED_GUEST_COUNT)
            .downPaymentAmount(UPDATED_DOWN_PAYMENT_AMOUNT)
            .downPaymentSettled(UPDATED_DOWN_PAYMENT_SETTLED)
            .createDate(UPDATED_CREATE_DATE)
            .modificationDate(UPDATED_MODIFICATION_DATE);

        restReservationOrderMockMvc.perform(put("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedReservationOrder)))
            .andExpect(status().isOk());

        // Validate the ReservationOrder in the database
        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeUpdate);
        ReservationOrder testReservationOrder = reservationOrderList.get(reservationOrderList.size() - 1);
        assertThat(testReservationOrder.isReservationConfirmed()).isEqualTo(UPDATED_RESERVATION_CONFIRMED);
        assertThat(testReservationOrder.getGuestCount()).isEqualTo(UPDATED_GUEST_COUNT);
        assertThat(testReservationOrder.getDownPaymentAmount()).isEqualTo(UPDATED_DOWN_PAYMENT_AMOUNT);
        assertThat(testReservationOrder.isDownPaymentSettled()).isEqualTo(UPDATED_DOWN_PAYMENT_SETTLED);
        assertThat(testReservationOrder.getCreateDate()).isEqualTo(EXPECTED_CREATE_DATE);
        assertThat(testReservationOrder.getModificationDate()).isEqualTo(EXPECTED_MODIFICATION_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingReservationOrder() throws Exception {
        int databaseSizeBeforeUpdate = reservationOrderRepository.findAll().size();

        // Create the ReservationOrder

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReservationOrderMockMvc.perform(put("/api/reservation-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ReservationOrder in the database
        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteReservationOrder() throws Exception {
        // Initialize the database
        reservationOrderService.save(reservationOrder);

        int databaseSizeBeforeDelete = reservationOrderRepository.findAll().size();

        // Delete the reservationOrder
        restReservationOrderMockMvc.perform(delete("/api/reservation-orders/{id}", reservationOrder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ReservationOrder> reservationOrderList = reservationOrderRepository.findAll();
        assertThat(reservationOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReservationOrder.class);
        ReservationOrder reservationOrder1 = new ReservationOrder();
        reservationOrder1.setId(1L);
        ReservationOrder reservationOrder2 = new ReservationOrder();
        reservationOrder2.setId(reservationOrder1.getId());
        assertThat(reservationOrder1).isEqualTo(reservationOrder2);
        reservationOrder2.setId(2L);
        assertThat(reservationOrder1).isNotEqualTo(reservationOrder2);
        reservationOrder1.setId(null);
        assertThat(reservationOrder1).isNotEqualTo(reservationOrder2);
    }
}
