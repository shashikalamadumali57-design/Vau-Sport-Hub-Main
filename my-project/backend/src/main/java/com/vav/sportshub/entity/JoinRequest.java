package com.vav.sportshub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "join_requests")
public class JoinRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sportName;
    private String teamCategory; // "Boys" or "Girls"
    private String faculty;
    private String regNo;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String senderName;
    private String senderEmail;
    private String image; // New field for profile picture URL

    // PENDING, APPROVED, REJECTED
    private String status;

    private LocalDateTime timestamp;

    public JoinRequest() {
    }

    public JoinRequest(Long id, String sportName, String teamCategory, String faculty, String regNo, String message,
            String senderName, String senderEmail, String status, LocalDateTime timestamp) {
        this.id = id;
        this.sportName = sportName;
        this.teamCategory = teamCategory;
        this.faculty = faculty;
        this.regNo = regNo;
        this.message = message;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.status = status;
        this.timestamp = timestamp;
    }

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

    public String getTeamCategory() {
        return teamCategory;
    }

    public void setTeamCategory(String teamCategory) {
        this.teamCategory = teamCategory;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getRegNo() {
        return regNo;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }

    @Override
    public String toString() {
        return "JoinRequest{" +
                "id=" + id +
                ", sportName='" + sportName + '\'' +
                ", teamCategory='" + teamCategory + '\'' +
                ", senderName='" + senderName + '\'' +
                ", senderEmail='" + senderEmail + '\'' +
                '}';
    }
}
