//package com.example.backend.controller
//
//import com.example.backend.repository.UserRepository
//import org.springframework.security.core.context.SecurityContextHolder
//import org.springframework.web.bind.annotation.GetMapping
//import org.springframework.web.bind.annotation.RequestParam
//import org.springframework.web.bind.annotation.RestController
//
//@RestController
//class UserController(val userRepository: UserRepository) {
//    @GetMapping("/api/user")
//    fun getSigninUser(): Long {
//        val name: String = SecurityContextHolder.getContext().getAuthentication().getName();
//        return userRepository.getUserId(name)
//    }
//}