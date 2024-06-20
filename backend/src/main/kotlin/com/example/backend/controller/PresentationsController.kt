package com.example.backend.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class PresentationsController {
    @GetMapping("/api/presentations")
    fun getPresentations(): String {
        return "Presentations"
    }
}

