package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.Company;
import io.pogorzelski.mywedding.domain.Customer;
import io.pogorzelski.mywedding.domain.Offer;
import io.pogorzelski.mywedding.domain.ReservationOrder;
import io.pogorzelski.mywedding.repository.OfferRepository;
import io.pogorzelski.mywedding.repository.ReservationOrderRepository;
import io.pogorzelski.mywedding.security.SecurityUtils;
import io.pogorzelski.mywedding.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.hibernate.id.IdentifierGenerator.ENTITY_NAME;

/**
 * Service Implementation for managing ReservationOrder.
 */
@Service
@Transactional
public class ReservationOrderService {

    private final Logger log = LoggerFactory.getLogger(ReservationOrderService.class);

    private final ReservationOrderRepository reservationOrderRepository;
    private final OfferRepository offerRepository;
    private final UserService userService;
    private final Clock clock;

    public ReservationOrderService(ReservationOrderRepository reservationOrderRepository, OfferRepository offerRepository, UserService userService, Clock clock) {
        this.reservationOrderRepository = reservationOrderRepository;
        this.offerRepository = offerRepository;
        this.userService = userService;
        this.clock = clock;
    }

    /**
     * Save a reservationOrder.
     *
     * @param reservationOrder the entity to save
     * @return the persisted entity
     */
    public ReservationOrder save(ReservationOrder reservationOrder) {
        log.debug("Request to save ReservationOrder : {}", reservationOrder);
        final Customer customer = userService.getCustomer()
            .orElseThrow(() -> new BadRequestAlertException("Customer not exist for user " + SecurityUtils.getCurrentUserLogin(), ENTITY_NAME, "nocustomer"));
        reservationOrder.setCustomer(customer);

        final LocalDate now = LocalDate.now(clock);
        if (reservationOrder.getId() == null){
            reservationOrder.setCreateDate(now);
            reservationOrder.setReservationConfirmed(false);
        } else {
            ReservationOrder oldEntity = reservationOrderRepository.getOne(reservationOrder.getId());
            reservationOrder.setCreateDate(oldEntity.getCreateDate());
        }
        reservationOrder.setModificationDate(now);
        final Offer offer = reservationOrder.getOffer();
        offer.setAvailable(false);
        offerRepository.save(offer);
        return reservationOrderRepository.save(reservationOrder);
    }

    /**
     * Get all the reservationOrders.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<ReservationOrder> findAll() {
        log.debug("Request to get all ReservationOrders");
        return reservationOrderRepository.findAll();
    }


    /**
     * Get one reservationOrder by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<ReservationOrder> findOne(Long id) {
        log.debug("Request to get ReservationOrder : {}", id);
        return reservationOrderRepository.findById(id);
    }

    /**
     * Delete the reservationOrder by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete ReservationOrder : {}", id);
        reservationOrderRepository.deleteById(id);
    }

    /**
     * Get one reservationOrder by offer id.
     *
     * @param id the id of the offer
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<ReservationOrder> findByOfferId(Long id) {
        log.debug("Request to get ReservationOrder by Offer : {}", id);
        return reservationOrderRepository.findByOfferId(id);
    }

    /**
     * Get one reservationOrder by customer
     *
     * @param customer who made reservation
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<ReservationOrder> findByCustomer(Customer customer) {
        log.debug("Request to get ReservationOrders by customer : {}", customer.getId());
        return reservationOrderRepository.findByCustomer(customer);
    }

    /**
     * Get one reservationOrder by company
     *
     * @param company owner of reserved wedding hall
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<ReservationOrder> findByCompany(Company company) {
        log.debug("Request to get ReservationOrders by customer : {}", company.getId());
        return reservationOrderRepository.findByOffer_WeddingHall_Company(company);
    }
}
