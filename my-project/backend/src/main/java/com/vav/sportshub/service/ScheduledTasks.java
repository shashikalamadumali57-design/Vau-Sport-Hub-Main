package com.vav.sportshub.service;

import com.vav.sportshub.entity.Match;
import com.vav.sportshub.entity.User;
import com.vav.sportshub.repository.MatchRepository;
import com.vav.sportshub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class ScheduledTasks {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Autowired
    public ScheduledTasks(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    // Runs every minute at second 0
    @Scheduled(cron = "0 * * * * *")
    public void sendMatchReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime target = now.plusMinutes(30).truncatedTo(ChronoUnit.MINUTES);

        List<Match> matches = matchRepository.findAll();
        for (Match match : matches) {
            if (match.getStatus() != null && match.getStatus().equalsIgnoreCase("Upcoming")) {
                if (match.getDate() == null || match.getTime() == null) continue;
                LocalDateTime matchDateTime = LocalDateTime.of(match.getDate(), match.getTime()).truncatedTo(ChronoUnit.MINUTES);
                if (matchDateTime.equals(target)) {
                    List<User> users = userRepository.findAll();
                    for (User user : users) {
                        if (user.getEmail() != null && !user.getEmail().isBlank()) {
                            // Email notification removed - log instead
                            System.out.println("Match reminder: " + user.getEmail() +
                                " has an upcoming match - " + match.getSportName() +
                                " at " + match.getVenue());
                        }
                    }
                }
            }
        }
    }
}
