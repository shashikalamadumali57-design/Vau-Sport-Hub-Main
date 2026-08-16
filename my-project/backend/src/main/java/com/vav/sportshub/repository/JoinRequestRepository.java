package com.vav.sportshub.repository;

import com.vav.sportshub.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findBySportNameAndTeamCategory(String sportName, String teamCategory);

    List<JoinRequest> findBySportNameAndTeamCategoryAndStatus(String sportName, String teamCategory, String status);

    List<JoinRequest> findByStatus(String status);
}
