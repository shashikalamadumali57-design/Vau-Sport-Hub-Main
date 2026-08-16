package com.vav.sportshub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.vav.sportshub.entity.Announcement;
import com.vav.sportshub.repository.AnnouncementRepository;
import java.util.List;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    @PostMapping
    @SuppressWarnings("null")
    public Announcement createAnnouncement(@RequestBody Announcement announcement) {
        return Objects.requireNonNull(announcementRepository.save(announcement));
    }

    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public Announcement updateAnnouncement(@PathVariable long id,
            @RequestBody Announcement announcementDetails) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        announcement.setTitle(announcementDetails.getTitle());
        announcement.setDate(announcementDetails.getDate());
        announcement.setContent(announcementDetails.getContent());
        announcement.setAuthor(announcementDetails.getAuthor());
        return Objects.requireNonNull(announcementRepository.save(announcement));
    }

    @DeleteMapping("/{id}")
    public void deleteAnnouncement(@PathVariable long id) {
        announcementRepository.deleteById(id);
    }
}
