package com.vav.sportshub.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sportName;
    private String team1;
    private String team2;
    private LocalDate date;
    private LocalTime time;
    private String venue;

    private String status;
    private String score;
    private String winner;
    private String type; // "Match" or "Practice"

    public Match() {
    }

    public Match(Long id, String sportName, String team1, String team2, LocalDate date, LocalTime time, String venue,
            String status, String score, String winner, String type) {
        this.id = id;
        this.sportName = sportName;
        this.team1 = team1;
        this.team2 = team2;
        this.date = date;
        this.time = time;
        this.venue = venue;
        this.status = status;
        this.score = score;
        this.winner = winner;
        this.type = type;
    }

    // ... existing getters/setters ...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSportName() {
        return sportName;
    }

    public void setSportName(String sportName) {
        this.sportName = sportName;
    }

    public String getTeam1() {
        return team1;
    }

    public void setTeam1(String team1) {
        this.team1 = team1;
    }

    public String getTeam2() {
        return team2;
    }

    public void setTeam2(String team2) {
        this.team2 = team2;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
