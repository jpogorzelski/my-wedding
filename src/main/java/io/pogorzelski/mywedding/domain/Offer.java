package io.pogorzelski.mywedding.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Offer.
 */
@Entity
@Table(name = "offer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Offer implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private Instant eventDate;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "price_per_capita", precision = 10, scale = 2, nullable = false)
    private BigDecimal pricePerCapita;

    @NotNull
    @Column(name = "available", nullable = false)
    private Boolean available;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("offers")
    private WeddingHall weddingHall;

    @OneToOne(mappedBy = "offer")
    @JsonIgnore
    private ReservationOrder reservationOrder;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getEventDate() {
        return eventDate;
    }

    public Offer eventDate(Instant eventDate) {
        this.eventDate = eventDate;
        return this;
    }

    public void setEventDate(Instant eventDate) {
        this.eventDate = eventDate;
    }

    public String getDescription() {
        return description;
    }

    public Offer description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPricePerCapita() {
        return pricePerCapita;
    }

    public Offer pricePerCapita(BigDecimal pricePerCapita) {
        this.pricePerCapita = pricePerCapita;
        return this;
    }

    public void setPricePerCapita(BigDecimal pricePerCapita) {
        this.pricePerCapita = pricePerCapita;
    }

    public Boolean isAvailable() {
        return available;
    }

    public Offer available(Boolean available) {
        this.available = available;
        return this;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public Offer startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Offer endDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public WeddingHall getWeddingHall() {
        return weddingHall;
    }

    public Offer weddingHall(WeddingHall weddingHall) {
        this.weddingHall = weddingHall;
        return this;
    }

    public void setWeddingHall(WeddingHall weddingHall) {
        this.weddingHall = weddingHall;
    }

    public ReservationOrder getReservationOrder() {
        return reservationOrder;
    }

    public Offer reservationOrder(ReservationOrder reservationOrder) {
        this.reservationOrder = reservationOrder;
        return this;
    }

    public void setReservationOrder(ReservationOrder reservationOrder) {
        this.reservationOrder = reservationOrder;
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
        Offer offer = (Offer) o;
        if (offer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), offer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Offer{" +
            "id=" + getId() +
            ", eventDate='" + getEventDate() + "'" +
            ", description='" + getDescription() + "'" +
            ", pricePerCapita=" + getPricePerCapita() +
            ", available='" + isAvailable() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            "}";
    }
}
