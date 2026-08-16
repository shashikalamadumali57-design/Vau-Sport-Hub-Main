package com.vav.sportshub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vav.sportshub.entity.Sport;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
}
