package com.vav.sportshub.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "sports")
public class Sport {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  private String image;
  private String coach;
  private String description;

  @OneToMany(mappedBy = "sport", cascade = CascadeType.ALL)
  private List<Team> teams;

  public Sport() {
  }

  public Sport(Long id, String name, String image, String coach, String description, List<Team> teams) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.coach = coach;
    this.description = description;
    this.teams = teams;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public String getCoach() {
    return coach;
  }

  public void setCoach(String coach) {
    this.coach = coach;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<Team> getTeams() {
    return teams;
  }

  public void setTeams(List<Team> teams) {
    this.teams = teams;
  }
}
