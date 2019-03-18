package io.pogorzelski.mywedding.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A WeddingHall.
 */
@Entity
@Table(name = "wedding_hall")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "weddinghall", replicas = 0)
public class WeddingHall implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "hall_name", nullable = false)
    private String hallName;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("weddingHalls")
    private Address address;

    @ManyToOne
    @JsonIgnoreProperties("weddingHalls")
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHallName() {
        return hallName;
    }

    public WeddingHall hallName(String hallName) {
        this.hallName = hallName;
        return this;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }

    public Address getAddress() {
        return address;
    }

    public WeddingHall address(Address address) {
        this.address = address;
        return this;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Company getCompany() {
        return company;
    }

    public WeddingHall company(Company company) {
        this.company = company;
        return this;
    }

    public void setCompany(Company company) {
        this.company = company;
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
        WeddingHall weddingHall = (WeddingHall) o;
        if (weddingHall.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), weddingHall.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "WeddingHall{" +
            "id=" + getId() +
            ", hallName='" + getHallName() + "'" +
            "}";
    }
}
