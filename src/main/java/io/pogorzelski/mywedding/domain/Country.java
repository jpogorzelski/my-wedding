package io.pogorzelski.mywedding.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
 * A Country.
 */
@Entity
@Table(name = "country")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "country", shards = 1, replicas = 0)
public class Country implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "country_name", nullable = false)
    private String countryName;

    @OneToMany(mappedBy = "country")
    @JsonIgnore
    private Set<Province> provinces = new HashSet<>();

    @OneToMany(mappedBy = "country")
    @JsonIgnore
    private Set<City> cities = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountryName() {
        return countryName;
    }

    public Country countryName(String countryName) {
        this.countryName = countryName;
        return this;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public Set<Province> getProvinces() {
        return provinces;
    }

    public Country provinces(Set<Province> provinces) {
        this.provinces = provinces;
        return this;
    }

    public Country addProvinces(Province province) {
        this.provinces.add(province);
        province.setCountry(this);
        return this;
    }

    public Country removeProvinces(Province province) {
        this.provinces.remove(province);
        province.setCountry(null);
        return this;
    }

    public void setProvinces(Set<Province> provinces) {
        this.provinces = provinces;
    }

    public Set<City> getCities() {
        return cities;
    }

    public Country cities(Set<City> cities) {
        this.cities = cities;
        return this;
    }

    public Country addCities(City city) {
        this.cities.add(city);
        city.setCountry(this);
        return this;
    }

    public Country removeCities(City city) {
        this.cities.remove(city);
        city.setCountry(null);
        return this;
    }

    public void setCities(Set<City> cities) {
        this.cities = cities;
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
        Country country = (Country) o;
        if (country.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), country.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Country{" +
            "id=" + getId() +
            ", countryName='" + getCountryName() + "'" +
            "}";
    }
}
