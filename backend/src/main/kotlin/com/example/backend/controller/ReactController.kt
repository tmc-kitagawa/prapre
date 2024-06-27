package com.example.backend.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class ReactController {
    @GetMapping("/calibration")
    fun calibration(): String {
        return "forward:/"
    }

    @GetMapping("/presentation")
    fun presentation(): String {
        return "forward:/"
    }

    @GetMapping("/result")
    fun result(): String {
        return "forward:/"
    }
}