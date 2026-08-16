package com.vav.sportshub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.vav.sportshub.entity.Sport;
import com.vav.sportshub.repository.SportRepository;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sports")
public class SportController {

    @Autowired
    private SportRepository sportRepository;

    @GetMapping
    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    @GetMapping("/{id}")
    public Sport getSportById(@PathVariable long id) {
        return sportRepository.findById(id).orElseThrow(() -> new RuntimeException("Sport not found"));
    }

    // We would need POST/PUT/DELETE for admin functionality
}
