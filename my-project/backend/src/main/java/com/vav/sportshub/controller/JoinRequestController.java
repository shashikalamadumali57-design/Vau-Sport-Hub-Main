package com.vav.sportshub.controller;

import com.vav.sportshub.entity.JoinRequest;
import com.vav.sportshub.entity.Player;
import com.vav.sportshub.entity.Team;
import com.vav.sportshub.repository.JoinRequestRepository;
import com.vav.sportshub.repository.PlayerRepository;
import com.vav.sportshub.repository.TeamRepository;
import com.vav.sportshub.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/join-requests")
public class JoinRequestController {

    @Autowired
    JoinRequestRepository joinRequestRepository;

    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    TeamRepository teamRepository;

    @PostMapping
    public ResponseEntity<?> createJoinRequest(
            @RequestBody JoinRequest joinRequest,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        String email = "";
        String name = "";
        
        // Check JWT authentication first
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) principal;
                email = userDetails.getEmail();
                name = userDetails.getUsername();
            } else {
                email = authentication.getName();
                name = authentication.getName();
            }
        } else if (emailHeader != null && !emailHeader.isEmpty()) {
            // Fallback: use email from header (for mobile clients)
            email = emailHeader;
            name = emailHeader;
        } else {
            return ResponseEntity.status(401).body("Error: You must be logged in to join a team.");
        }

        // Validate request
        if (joinRequest.getSportName() == null || joinRequest.getTeamCategory() == null) {
            return ResponseEntity.badRequest().body("Error: Sport Name and Team Category are required.");
        }

        // Validate that the target team actually exists
        Optional<Team> teamOpt = teamRepository.findBySportNameIgnoreCaseAndCategoryIgnoreCase(
                joinRequest.getSportName(),
                joinRequest.getTeamCategory());

        if (teamOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: The team '" + joinRequest.getSportName() + " ("
                    + joinRequest.getTeamCategory() + ")' does not exist.");
        }

        joinRequest.setSenderEmail(email);
        joinRequest.setSenderName(name);
        joinRequest.setStatus("PENDING");
        joinRequest.setTimestamp(LocalDateTime.now());

        JoinRequest savedRequest = joinRequestRepository.save(joinRequest);
        return ResponseEntity.ok(savedRequest);
    }

    @GetMapping("/{sportName}/{teamCategory}")
    public ResponseEntity<?> getRequests(@PathVariable String sportName, @PathVariable String teamCategory,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthorized = false;
        String email = "";

        // Check Security Context first
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            // Admin, Coach, Captain, or Vice-Captain can see this
            if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                    || a.getAuthority().equals("ROLE_COACH")
                    || a.getAuthority().equals("ROLE_CAPTAIN")
                    || a.getAuthority().equals("ROLE_VICE_CAPTAIN"))) {
                isAuthorized = true;
            }
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetailsImpl) {
                email = ((UserDetailsImpl) principal).getEmail();
            } else {
                email = authentication.getName();
            }
        } else {
            // Fallback to headers (DEV MODE / Simple Auth)
            if ("admin".equalsIgnoreCase(roleHeader) || "ROLE_ADMIN".equalsIgnoreCase(roleHeader) ||
                    "coach".equalsIgnoreCase(roleHeader) || "ROLE_COACH".equalsIgnoreCase(roleHeader)) {
                isAuthorized = true;
            }
            email = emailHeader;
        }

        // 1. Authorized roles (Admin/Coach) can see everything
        if (isAuthorized) {
            List<JoinRequest> requests = joinRequestRepository.findBySportNameAndTeamCategory(sportName, teamCategory);
            return ResponseEntity.ok(requests);
        }

        // 2. Identify user
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(401).body("User not identified");
        }

        // 3. Check if user is a member of the requested team (Team Captains/Members
        // check)
        return playerRepository.findByEmail(email)
                .map(player -> {
                    if (player.getTeam() != null && player.getTeam().getSport() != null) {
                        String userSport = player.getTeam().getSport().getName();
                        String userCategory = player.getTeam().getCategory();

                        if (userSport.equalsIgnoreCase(sportName) && userCategory.equalsIgnoreCase(teamCategory)) {
                            List<JoinRequest> requests = joinRequestRepository.findBySportNameAndTeamCategory(sportName,
                                    teamCategory);
                            return ResponseEntity.ok(requests);
                        }
                    }
                    return ResponseEntity.status(403)
                            .body("Access Denied: You are not authorized to view requests for this team.");
                })
                .orElse(ResponseEntity.status(403).body("Access Denied: Player profile not found."));
    }

    // Check for pending notifications for the current user's team
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAuthorized = false;
        String email = "";

        // Check Security Context first
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                    || a.getAuthority().equals("ROLE_COACH")
                    || a.getAuthority().equals("ROLE_CAPTAIN")
                    || a.getAuthority().equals("ROLE_VICE_CAPTAIN"))) {
                isAuthorized = true;
            }
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetailsImpl) {
                email = ((UserDetailsImpl) principal).getEmail();
            } else {
                email = authentication.getName();
            }
        } else {
            // Fallback to headers (DEV MODE)
            if ("admin".equalsIgnoreCase(roleHeader) || "ROLE_ADMIN".equalsIgnoreCase(roleHeader) ||
                    "coach".equalsIgnoreCase(roleHeader) || "ROLE_COACH".equalsIgnoreCase(roleHeader)) {
                isAuthorized = true;
            }
            email = emailHeader;
        }

        if (isAuthorized) {
            // Admins/Coaches can see all pending requests for convenience,
            // or we could filter by their team if they are a coach.
            return ResponseEntity.ok(joinRequestRepository.findByStatus("PENDING"));
        }

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("User not identified");
        }

        return playerRepository.findByEmail(email)
                .map(player -> {
                    // If player is found, get their team's sport and category
                    if (player.getTeam() != null && player.getTeam().getSport() != null) {
                        String sportName = player.getTeam().getSport().getName();
                        String category = player.getTeam().getCategory(); // e.g. "Boys" or "Girls"

                        // Fetch PENDING requests for this team
                        List<JoinRequest> requests = joinRequestRepository.findBySportNameAndTeamCategoryAndStatus(
                                sportName, category, "PENDING");
                        return ResponseEntity.ok(requests);
                    }
                    return ResponseEntity.ok(List.of());
                })
                .orElse(ResponseEntity.ok(List.of()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable long id, @RequestParam String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Error: You must be logged in to manage requests.");
        }

        return joinRequestRepository.findById(id).map(request -> {
            boolean hasPermission = false;

            // 1. Admins have power
            if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                hasPermission = true;
            } else {
                // 2. Coaches or Captains must belong to the target team
                String currentUserEmail = "";
                Object principal = authentication.getPrincipal();
                if (principal instanceof UserDetailsImpl) {
                    currentUserEmail = ((UserDetailsImpl) principal).getEmail();
                } else {
                    currentUserEmail = authentication.getName();
                }

                Optional<Player> manager = playerRepository.findByEmail(currentUserEmail);
                if (manager.isPresent() && manager.get().getTeam() != null) {
                    Team team = manager.get().getTeam();
                    if (team.getSport().getName().equalsIgnoreCase(request.getSportName()) &&
                            team.getCategory().equalsIgnoreCase(request.getTeamCategory())) {

                        // Check if they are Captain, Vice-Captain, or Coach
                        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COACH")
                                || a.getAuthority().equals("ROLE_CAPTAIN")
                                || a.getAuthority().equals("ROLE_VICE_CAPTAIN"))) {
                            hasPermission = true;
                        }
                    }
                }
            }

            if (!hasPermission) {
                return ResponseEntity.status(403)
                        .body("Access Denied: You do not have permission to manage this request.");
            }

            if ("APPROVED".equalsIgnoreCase(status) || "ACCEPTED".equalsIgnoreCase(status)) {
                String email = request.getSenderEmail();
                // Use case-insensitive matching to handle frontend "boys"/"girls" vs backend
                // "Boys"/"Girls"
                Optional<Team> teamOpt = teamRepository.findBySportNameIgnoreCaseAndCategoryIgnoreCase(
                        request.getSportName(),
                        request.getTeamCategory());

                if (teamOpt.isPresent()) {
                    Team team = teamOpt.get();
                    playerRepository.findByEmail(email).ifPresentOrElse(player -> {
                        player.setTeam(team);
                        if (request.getImage() != null && !request.getImage().isEmpty()) {
                            player.setImage(request.getImage());
                        }
                        playerRepository.save(player);
                    }, () -> {
                        Player newPlayer = new Player();
                        newPlayer.setName(request.getSenderName());
                        newPlayer.setEmail(request.getSenderEmail());
                        newPlayer.setTeam(team);
                        newPlayer.setRole("Member");
                        newPlayer.setImage(request.getImage());
                        playerRepository.save(newPlayer);
                    });
                    request.setStatus("APPROVED");
                } else {
                    return ResponseEntity.status(404).body("Error: Target team '" + request.getSportName() + " ("
                            + request.getTeamCategory() + ")' not found in database.");
                }
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                request.setStatus("REJECTED");
            } else {
                request.setStatus(status.toUpperCase());
            }

            joinRequestRepository.save(request);
            return ResponseEntity.ok("Request updated to " + request.getStatus());
        }).orElse(ResponseEntity.notFound().build());
    }
}
