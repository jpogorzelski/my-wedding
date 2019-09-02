package io.pogorzelski.mywedding.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
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
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "min_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal minPrice;

    @NotNull
    @Column(name = "max_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal maxPrice;

    @NotNull
    @Column(name = "price_unit", nullable = false)
    private String priceUnit;

    @OneToOne(mappedBy = "offer")
    @JsonIgnore
    private WeddingHall weddingHall;

    @OneToOne(mappedBy = "offer")
    @JsonIgnore
    private ReservationOrder reservationOrder;

    @OneToOne
    @JoinColumn(unique = true)
    private Album album;

    @OneToOne
    @JoinColumn(unique = true)
    private Photo photo;

    @OneToMany(mappedBy = "offer")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<EventDate> eventDates = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public Offer minPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
        return this;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public Offer maxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
        return this;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getPriceUnit() {
        return priceUnit;
    }

    public Offer priceUnit(String priceUnit) {
        this.priceUnit = priceUnit;
        return this;
    }

    public void setPriceUnit(String priceUnit) {
        this.priceUnit = priceUnit;
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

    public Album getAlbum() {
        return album;
    }

    public Offer album(Album album) {
        this.album = album;
        return this;
    }

    public void setAlbum(Album album) {
        this.album = album;
    }

    public Photo getPhoto() {
        return photo;
    }

    public Offer photo(Photo photo) {
        this.photo = photo;
        return this;
    }

    public void setPhoto(Photo photo) {
        this.photo = photo;
    }

    public Set<EventDate> getEventDates() {
        return eventDates;
    }

    public Offer eventDates(Set<EventDate> eventDates) {
        this.eventDates = eventDates;
        return this;
    }

    public Offer addEventDates(EventDate eventDate) {
        this.eventDates.add(eventDate);
        eventDate.setOffer(this);
        return this;
    }

    public Offer removeEventDates(EventDate eventDate) {
        this.eventDates.remove(eventDate);
        eventDate.setOffer(null);
        return this;
    }

    public void setEventDates(Set<EventDate> eventDates) {
        this.eventDates = eventDates;
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
            ", description='" + getDescription() + "'" +
            ", minPrice=" + getMinPrice() +
            ", maxPrice=" + getMaxPrice() +
            ", priceUnit='" + getPriceUnit() + "'" +
            "}";
    }
}
