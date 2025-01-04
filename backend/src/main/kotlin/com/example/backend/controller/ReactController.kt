package com.example.backend.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class ReactController {
    @GetMapping("/presentation")
    fun presentation(): String {
        return "redirect:/"
    }

    @GetMapping("/result")
    fun result(): String {
        return "redirect:/"
    }

    @GetMapping("/allresults")
    fun allResult(): String {
        return "forward:/"
    }

    @GetMapping("/record")
    fun record(): String {
        return "forward:/"
    }
}