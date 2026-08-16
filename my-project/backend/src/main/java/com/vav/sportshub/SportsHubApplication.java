package com.vav.sportshub;

import com.vav.sportshub.entity.Announcement;
import com.vav.sportshub.entity.Match;
import com.vav.sportshub.entity.User;
import com.vav.sportshub.repository.AnnouncementRepository;
import com.vav.sportshub.repository.MatchRepository;
import com.vav.sportshub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.vav.sportshub.repository.PlayerRepository; // Added import

@SpringBootApplication
@EnableScheduling
public class SportsHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(SportsHubApplication.class, args);
	}

	@Bean
	@SuppressWarnings("null")
	CommandLineRunner initDatabase(MatchRepository matchRepository,
			AnnouncementRepository announcementRepository,
			UserRepository userRepository,
			com.vav.sportshub.repository.SportRepository sportRepository,
			com.vav.sportshub.repository.TeamRepository teamRepository,
			PlayerRepository playerRepository, // Added argument
			PasswordEncoder passwordEncoder) {
		return args -> {
			// Seed Sports and Teams first
			if (sportRepository.count() == 0) {
				List<String> sports = List.of("Basketball", "Football", "Tennis", "Swimming", "Volleyball", "Elle",
						"Cricket", "Rugby", "Athletics", "Table Tennis", "Karate", "Netball");
				for (String sportName : sports) {
					com.vav.sportshub.entity.Sport sport = new com.vav.sportshub.entity.Sport();
					sport.setName(sportName);
					sport.setCoach("Coach " + sportName);
					sport.setDescription("Official team for " + sportName);
					sport.setImage("/images/" + sportName.toLowerCase().replace(" ", "_") + ".jpg");
					sport = sportRepository.save(sport);

					// Create Boys and Girls teams for each sport
					com.vav.sportshub.entity.Team boysTeam = new com.vav.sportshub.entity.Team();
					boysTeam.setSport(sport);
					boysTeam.setCategory("Boys");
					teamRepository.save(boysTeam);

					com.vav.sportshub.entity.Team girlsTeam = new com.vav.sportshub.entity.Team();
					girlsTeam.setSport(sport);
					girlsTeam.setCategory("Girls");
					teamRepository.save(girlsTeam);
				}
			}

			if (matchRepository.count() == 0) {
				matchRepository.saveAll(List.of(
						new Match(null, "Basketball", "Lakers", "Celtics", LocalDate.now().plusDays(1),
								LocalTime.of(18, 30), "Main Gym", "Upcoming", null, null, "Match"),
						new Match(null, "Football", "Tigers", "Eagles", LocalDate.now().minusDays(1),
								LocalTime.of(15, 0), "Central Stadium", "Completed", "2-1", "Tigers", "Match"),
						// Practice Sessions
						new Match(null, "Basketball", "Boys Team", "Practice", LocalDate.now().plusDays(2),
								LocalTime.of(16, 0), "Practice Court 1", "Upcoming", null, null, "Practice"),
						new Match(null, "Football", "Girls Team", "Drills", LocalDate.now().plusDays(3),
								LocalTime.of(17, 0), "Field B", "Upcoming", null, null, "Practice")));
			}

			if (announcementRepository.count() == 0) {
				announcementRepository.saveAll(List.of(
						new Announcement(null, "Upcoming Basketball Trials", LocalDate.now(),
								"Join us tomorrow for basketball trials at the main gym.", "Coach Carter"),
						new Announcement(null, "Championship Victory", LocalDate.now().minusDays(5),
								"Our football team has won the regional championship!", "Sports Director")));
			}

			// Ensure specific users exist regardless of count
			if (!userRepository.existsByUsername("admin")) {
				User admin = new User(null, "admin", "admin@vav.com", passwordEncoder.encode("admin123"),
						User.Role.ROLE_ADMIN);
				userRepository.save(admin);
			}
			if (!userRepository.existsByUsername("coach")) {
				User coach = new User(null, "coach", "coach@vav.com", passwordEncoder.encode("coach123"),
						User.Role.ROLE_COACH);
				userRepository.save(coach);
			}
			if (!userRepository.existsByUsername("student")) {
				User student = new User(null, "student", "student@vav.com", passwordEncoder.encode("student123"),
						User.Role.ROLE_STUDENT);
				userRepository.save(student);
			}

			if (!userRepository.existsByUsername("Isuru")) {
				User isuru = new User(null, "Isuru", "isuru@gmail.com", passwordEncoder.encode("password"),
						User.Role.ROLE_STUDENT);
				userRepository.save(isuru);
			}

			if (!userRepository.existsByUsername("admin1")) {
				User admin1 = new User(null, "admin1", "admin@test.com", passwordEncoder.encode("password"),
						User.Role.ROLE_ADMIN);
				userRepository.save(admin1);
			}
			if (!userRepository.existsByUsername("student2")) {
				User student2 = new User(null, "student2", "student2@vav.com", passwordEncoder.encode("student123"),
						User.Role.ROLE_STUDENT);
				userRepository.save(student2);
			}

			if (!userRepository.existsByUsername("captain")) {
				User captain = new User(null, "captain", "captain@vav.com", passwordEncoder.encode("captain123"),
						User.Role.ROLE_CAPTAIN);
				userRepository.save(captain);
			}

			// Seed Captain Player Profile (Critical for Dashboard Permissions)
			if (teamRepository.count() > 0) {
				teamRepository.findBySportNameIgnoreCaseAndCategoryIgnoreCase("Basketball", "Boys")
						.ifPresent(team -> {
							String captainEmail = "captain@vav.com";
							if (playerRepository.findByEmail(captainEmail).isEmpty()) {
								com.vav.sportshub.entity.Player captainPlayer = new com.vav.sportshub.entity.Player();
								captainPlayer.setName("Captain Steve");
								captainPlayer.setEmail(captainEmail);
								captainPlayer.setRole("Captain");
								captainPlayer.setTeam(team);
								playerRepository.save(captainPlayer);
							}
						});
			}
		};
	}
}
