package com.example.backend.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.security.provisioning.UserDetailsManager
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
class SecurityController(
    @Autowired val userDetailsManager: UserDetailsManager
) {
    @GetMapping("/signin")
    fun signin ():String{
        return "signin"
    }

    @GetMapping("/signup")
    fun signup ():String{
        return "signup"
    }

    @PostMapping("/signup")
    fun signup(
        @RequestParam("username") username: String,
        @RequestParam("password") password: String
    ): String {
        userDetailsManager.createUser(makeUser(username, password, "USER"))
        return "redirect: signin"
    }

    private fun makeUser(user: String, pw: String, role: String): UserDetails {
        return User.withUsername(user)
            .password(
                PasswordEncoderFactories
                    .createDelegatingPasswordEncoder()
                    .encode(pw)
            )
            .roles(role)
            .build()
    }
}