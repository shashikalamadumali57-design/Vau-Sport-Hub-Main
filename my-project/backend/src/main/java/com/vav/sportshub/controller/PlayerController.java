package com.vav.sportshub.controller;

import com.vav.sportshub.entity.Player;
import com.vav.sportshub.repository.PlayerRepository;
import com.vav.sportshub.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    com.vav.sportshub.repository.TeamRepository teamRepository; // If needed

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Error: You must be logged in.");
        }

        String email = "";
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            email = ((UserDetailsImpl) principal).getEmail();
        } else {
            email = authentication.getName();
        }

        Optional<Player> playerOpt = playerRepository.findByEmail(email);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", player.getId());
            response.put("name", player.getName());
            response.put("email", player.getEmail());
            response.put("role", player.getRole());
            response.put("image", player.getImage());

            if (player.getTeam() != null) {
                Map<String, Object> teamInfo = new HashMap<>();
                teamInfo.put("id", player.getTeam().getId());
                teamInfo.put("category", player.getTeam().getCategory());
                if (player.getTeam().getSport() != null) {
                    teamInfo.put("sportName", player.getTeam().getSport().getName());
                    teamInfo.put("sportId", player.getTeam().getSport().getId());
                }
                response.put("team", teamInfo);
            }
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
