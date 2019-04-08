package io.pogorzelski.mywedding.service;

import io.pogorzelski.mywedding.domain.ReservationOrder;
import io.pogorzelski.mywedding.repository.ReservationOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing ReservationOrder.
 */
@Service
@Transactional
public class ReservationOrderService {

    private final Logger log = LoggerFactory.getLogger(ReservationOrderService.class);

    private final ReservationOrderRepository reservationOrderRepository;

    public ReservationOrderService(ReservationOrderRepository reservationOrderRepository) {
        this.reservationOrderRepository = reservationOrderRepository;
    }

    /**
     * Save a reservationOrder.
     *
     * @param reservationOrder the entity to save
     * @return the persisted entity
     */
    public ReservationOrder save(ReservationOrder reservationOrder) {
        log.debug("Request to save ReservationOrder : {}", reservationOrder);
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
}
