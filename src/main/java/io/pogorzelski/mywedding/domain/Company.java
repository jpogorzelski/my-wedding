package io.pogorzelski.mywedding.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Company.
 */
@Entity
@Table(name = "company")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "company")
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @NotNull
    @Column(name = "street", nullable = false)
    private String street;

    @NotNull
    @Column(name = "house_no", nullable = false)
    private String houseNo;

    @Column(name = "flat_no")
    private String flatNo;

    @NotNull
    @Column(name = "postal_code", nullable = false)
    private String postalCode;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("companies")
    private Country country;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("companies")
    private Province province;

    @ManyToOne
    @JsonIgnoreProperties("companies")
    private City city;

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

    public String getStreet() {
        return street;
    }

    public Company street(String street) {
        this.street = street;
        return this;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getHouseNo() {
        return houseNo;
    }

    public Company houseNo(String houseNo) {
        this.houseNo = houseNo;
        return this;
    }

    public void setHouseNo(String houseNo) {
        this.houseNo = houseNo;
    }

    public String getFlatNo() {
        return flatNo;
    }

    public Company flatNo(String flatNo) {
        this.flatNo = flatNo;
        return this;
    }

    public void setFlatNo(String flatNo) {
        this.flatNo = flatNo;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public Company postalCode(String postalCode) {
        this.postalCode = postalCode;
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Country getCountry() {
        return country;
    }

    public Company country(Country country) {
        this.country = country;
        return this;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Province getProvince() {
        return province;
    }

    public Company province(Province province) {
        this.province = province;
        return this;
    }

    public void setProvince(Province province) {
        this.province = province;
    }

    public City getCity() {
        return city;
    }

    public Company city(City city) {
        this.city = city;
        return this;
    }

    public void setCity(City city) {
        this.city = city;
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
            ", street='" + getStreet() + "'" +
            ", houseNo='" + getHouseNo() + "'" +
            ", flatNo='" + getFlatNo() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            "}";
    }
}
