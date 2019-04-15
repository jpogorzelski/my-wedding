package io.pogorzelski.mywedding.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A ReservationOrder.
 */
@Entity
@Table(name = "reservation_order")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ReservationOrder implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "reservation_confirmed")
    private Boolean reservationConfirmed;

    @NotNull
    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    @NotNull
    @Column(name = "down_payment_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal downPaymentAmount;

    @Column(name = "down_payment_settled")
    private Boolean downPaymentSettled;

    @NotNull
    @Column(name = "create_date", nullable = false)
    private LocalDate createDate;

    @NotNull
    @Column(name = "modification_date", nullable = false)
    private LocalDate modificationDate;

    @OneToOne(optional = false)    @NotNull

    @JoinColumn(unique = true)
    private Offer offer;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("reservationOrders")
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isReservationConfirmed() {
        return reservationConfirmed;
    }

    public ReservationOrder reservationConfirmed(Boolean reservationConfirmed) {
        this.reservationConfirmed = reservationConfirmed;
        return this;
    }

    public void setReservationConfirmed(Boolean reservationConfirmed) {
        this.reservationConfirmed = reservationConfirmed;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public ReservationOrder guestCount(Integer guestCount) {
        this.guestCount = guestCount;
        return this;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public BigDecimal getDownPaymentAmount() {
        return downPaymentAmount;
    }

    public ReservationOrder downPaymentAmount(BigDecimal downPaymentAmount) {
        this.downPaymentAmount = downPaymentAmount;
        return this;
    }

    public void setDownPaymentAmount(BigDecimal downPaymentAmount) {
        this.downPaymentAmount = downPaymentAmount;
    }

    public Boolean isDownPaymentSettled() {
        return downPaymentSettled;
    }

    public ReservationOrder downPaymentSettled(Boolean downPaymentSettled) {
        this.downPaymentSettled = downPaymentSettled;
        return this;
    }

    public void setDownPaymentSettled(Boolean downPaymentSettled) {
        this.downPaymentSettled = downPaymentSettled;
    }

    public LocalDate getCreateDate() {
        return createDate;
    }

    public ReservationOrder createDate(LocalDate createDate) {
        this.createDate = createDate;
        return this;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    public LocalDate getModificationDate() {
        return modificationDate;
    }

    public ReservationOrder modificationDate(LocalDate modificationDate) {
        this.modificationDate = modificationDate;
        return this;
    }

    public void setModificationDate(LocalDate modificationDate) {
        this.modificationDate = modificationDate;
    }

    public Offer getOffer() {
        return offer;
    }

    public ReservationOrder offer(Offer offer) {
        this.offer = offer;
        return this;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }

    public Customer getCustomer() {
        return customer;
    }

    public ReservationOrder customer(Customer customer) {
        this.customer = customer;
        return this;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ReservationOrder reservationOrder = (ReservationOrder) o;
        if (reservationOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), reservationOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ReservationOrder{" +
            "id=" + getId() +
            ", reservationConfirmed='" + isReservationConfirmed() + "'" +
            ", guestCount=" + getGuestCount() +
            ", downPaymentAmount=" + getDownPaymentAmount() +
            ", downPaymentSettled='" + isDownPaymentSettled() + "'" +
            ", createDate='" + getCreateDate() + "'" +
            ", modificationDate='" + getModificationDate() + "'" +
            "}";
    }
}
