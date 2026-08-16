package com.vav.sportshub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.vav.sportshub.entity.Match;
import com.vav.sportshub.repository.MatchRepository;
import java.util.List;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @GetMapping
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    @GetMapping("/{id}")
    public Match getMatchById(@PathVariable long id) {
        return matchRepository.findById(id).orElseThrow(() -> new RuntimeException("Match not found"));
    }

    @PostMapping
    @SuppressWarnings("null")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CAPTAIN', 'VICE_CAPTAIN', 'COACH')")
    public Match createMatch(@RequestBody Match match) {
        return Objects.requireNonNull(matchRepository.save(match));
    }

    @PutMapping("/{id}")
    @SuppressWarnings("null")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CAPTAIN', 'VICE_CAPTAIN', 'COACH')")
    public Match updateMatch(@PathVariable long id, @RequestBody Match matchDetails) {
        Match match = matchRepository.findById(id).orElseThrow(() -> new RuntimeException("Match not found"));
        match.setSportName(matchDetails.getSportName());
        match.setTeam1(matchDetails.getTeam1());
        match.setTeam2(matchDetails.getTeam2());
        match.setDate(matchDetails.getDate());
        match.setTime(matchDetails.getTime());
        match.setVenue(matchDetails.getVenue());
        match.setStatus(matchDetails.getStatus());
        match.setScore(matchDetails.getScore());
        match.setWinner(matchDetails.getWinner());
        match.setType(matchDetails.getType());
        return Objects.requireNonNull(matchRepository.save(match));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CAPTAIN', 'VICE_CAPTAIN', 'COACH')")
    public void deleteMatch(@PathVariable long id) {
        matchRepository.deleteById(id);
    }
}
