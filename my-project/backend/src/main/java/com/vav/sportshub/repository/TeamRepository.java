package com.vav.sportshub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vav.sportshub.entity.Team;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    @Query("SELECT t FROM Team t JOIN t.sport s WHERE s.name = :sportName AND t.category = :category")
    Optional<Team> findBySportNameAndCategory(@Param("sportName") String sportName, @Param("category") String category);

    @Query("SELECT t FROM Team t JOIN t.sport s WHERE LOWER(s.name) = LOWER(:sportName) AND LOWER(t.category) = LOWER(:category)")
    Optional<Team> findBySportNameIgnoreCaseAndCategoryIgnoreCase(@Param("sportName") String sportName,
            @Param("category") String category);
}
