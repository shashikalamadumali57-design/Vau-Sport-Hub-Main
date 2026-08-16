-- ============================================================
-- VavSport Hub - MySQL Database Setup
-- Run this in MySQL Workbench or phpMyAdmin BEFORE starting
-- the Spring Boot backend.
-- ============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS sportshubdb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sportshubdb;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20)
);

-- Sports Table
CREATE TABLE IF NOT EXISTS sports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255),
    coach VARCHAR(255),
    description VARCHAR(255)
);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255),
    sport_id BIGINT,
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    image VARCHAR(255),
    email VARCHAR(50),
    team_id BIGINT,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    date DATE,
    content VARCHAR(1000),
    author VARCHAR(255)
);

-- Matches Table (includes 'type' column for Match vs Practice)
CREATE TABLE IF NOT EXISTS matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sport_name VARCHAR(255),
    team1 VARCHAR(255),
    team2 VARCHAR(255),
    date DATE,
    time TIME,
    venue VARCHAR(255),
    status VARCHAR(255),
    score VARCHAR(255),
    winner VARCHAR(255),
    type VARCHAR(50) DEFAULT 'Match'
);

-- Join Requests Table
CREATE TABLE IF NOT EXISTS join_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sport_name VARCHAR(255),
    team_category VARCHAR(255),
    faculty VARCHAR(255),
    reg_no VARCHAR(255),
    message TEXT,
    sender_name VARCHAR(255),
    sender_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- NOTE: Spring Boot (Hibernate ddl-auto=update) will
-- automatically create/update these tables when the app starts.
-- You only need to run this SQL manually to create the database.
-- ============================================================
