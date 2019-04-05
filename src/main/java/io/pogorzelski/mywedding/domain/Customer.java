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
 * A Customer.
 */
@Entity
@Table(name = "customer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "customer")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "phone_number")
    private String phoneNumber;

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

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("customers")
    private Country country;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("customers")
    private Province province;

    @ManyToOne
    @JsonIgnoreProperties("customers")
    private City city;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Customer phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStreet() {
        return street;
    }

    public Customer street(String street) {
        this.street = street;
        return this;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getHouseNo() {
        return houseNo;
    }

    public Customer houseNo(String houseNo) {
        this.houseNo = houseNo;
        return this;
    }

    public void setHouseNo(String houseNo) {
        this.houseNo = houseNo;
    }

    public String getFlatNo() {
        return flatNo;
    }

    public Customer flatNo(String flatNo) {
        this.flatNo = flatNo;
        return this;
    }

    public void setFlatNo(String flatNo) {
        this.flatNo = flatNo;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public Customer postalCode(String postalCode) {
        this.postalCode = postalCode;
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public User getUser() {
        return user;
    }

    public Customer user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Country getCountry() {
        return country;
    }

    public Customer country(Country country) {
        this.country = country;
        return this;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Province getProvince() {
        return province;
    }

    public Customer province(Province province) {
        this.province = province;
        return this;
    }

    public void setProvince(Province province) {
        this.province = province;
    }

    public City getCity() {
        return city;
    }

    public Customer city(City city) {
        this.city = city;
        return this;
    }

    public void setCity(City city) {
        this.city = city;
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
        Customer customer = (Customer) o;
        if (customer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), customer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", street='" + getStreet() + "'" +
            ", houseNo='" + getHouseNo() + "'" +
            ", flatNo='" + getFlatNo() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            "}";
    }
}
