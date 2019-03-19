package io.pogorzelski.mywedding.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Company.
 */
@Entity
@Table(name = "company")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "company", shards = 1, replicas = 0)
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("companies")
    private Address address;

    @OneToMany(mappedBy = "company")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WeddingHall> weddingHalls = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public Company companyName(String companyName) {
        this.companyName = companyName;
        return this;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Address getAddress() {
        return address;
    }

    public Company address(Address address) {
        this.address = address;
        return this;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Set<WeddingHall> getWeddingHalls() {
        return weddingHalls;
    }

    public Company weddingHalls(Set<WeddingHall> weddingHalls) {
        this.weddingHalls = weddingHalls;
        return this;
    }

    public Company addWeddingHalls(WeddingHall weddingHall) {
        this.weddingHalls.add(weddingHall);
        weddingHall.setCompany(this);
        return this;
    }

    public Company removeWeddingHalls(WeddingHall weddingHall) {
        this.weddingHalls.remove(weddingHall);
        weddingHall.setCompany(null);
        return this;
    }

    public void setWeddingHalls(Set<WeddingHall> weddingHalls) {
        this.weddingHalls = weddingHalls;
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
        Company company = (Company) o;
        if (company.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), company.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Company{" +
            "id=" + getId() +
            ", companyName='" + getCompanyName() + "'" +
            "}";
    }
}
