package com.example.backend.controller

import com.example.backend.dataclass.Presentation
import com.example.backend.dataclass.Request
import com.example.backend.repository.PresentationRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
class PresentationsController(val presentationRepository: PresentationRepository) {
    @GetMapping("/api/presentations")
    fun getPresentations(): List<Presentation> {
        return presentationRepository.getPresentations()
    }

    @GetMapping("/api/presentations/{userid}")
    fun getPresentationsOfUser(@PathVariable("userid") userid: Long): List<Presentation> {
        return presentationRepository.getPresentationsOfUser(userid)
    }

    @PostMapping("/api/histories")
    @ResponseStatus(HttpStatus.CREATED)
    fun addHistories(@RequestBody request: Request): String {
        presentationRepository.insertHistory(request)
        return "historyをPOSTするよ!"
    }
}

