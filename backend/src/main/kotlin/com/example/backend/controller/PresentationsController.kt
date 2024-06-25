package com.example.backend.controller

import com.example.backend.dataclass.Presentation
import com.example.backend.repository.PresentationRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class PresentationsController(val presentationRepository: PresentationRepository) {
    @GetMapping("/api/presentations")
    fun getPresentations(): List<Presentation> {
        return presentationRepository.getPresentations()
    }

}

