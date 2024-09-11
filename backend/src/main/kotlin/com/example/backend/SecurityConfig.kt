//package com.example.backend
//
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.context.annotation.Bean
//import org.springframework.context.annotation.Configuration
//import org.springframework.http.HttpMethod
//import org.springframework.security.config.Customizer
//import org.springframework.security.config.annotation.web.builders.HttpSecurity
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
//import org.springframework.security.config.annotation.web.configurers.FormLoginConfigurer
//import org.springframework.security.core.userdetails.User
//import org.springframework.security.core.userdetails.UserDetails
//import org.springframework.security.crypto.factory.PasswordEncoderFactories
//import org.springframework.security.provisioning.JdbcUserDetailsManager
//import org.springframework.security.provisioning.UserDetailsManager
//import org.springframework.security.web.SecurityFilterChain
//import javax.sql.DataSource
//
//@Configuration
//@EnableWebSecurity
//class SecurityConfig {
//    @Autowired
//    private val dataSource: DataSource? = null
//
//    @Bean
//    fun userDetailsManager(): UserDetailsManager {
//        val users = JdbcUserDetailsManager(this.dataSource)
////        users.createUser(makeUser("user", "password", "USER"))
//        return users
//    }
//
//    private fun makeUser(user: String, pw: String, role: String): UserDetails {
//        return User.withUsername(user)
//            .password(
//                PasswordEncoderFactories
//                    .createDelegatingPasswordEncoder()
//                    .encode(pw)
//            )
//            .roles(role)
//            .build()
//    }
//
//    @Bean
//    fun configureHttpSecurity(httpSecurity: HttpSecurity): SecurityFilterChain {
//        httpSecurity.csrf { authorize ->
//            authorize.ignoringRequestMatchers("/api/histories")
//            authorize.ignoringRequestMatchers("/logout")
//        }
//        httpSecurity
//            .authorizeHttpRequests(Customizer { authorize ->
//                authorize
//                    .requestMatchers("/signin").permitAll()
//                    .requestMatchers("/signup").permitAll()
//                    .requestMatchers("/css/**").permitAll()
//                    .requestMatchers("/api/presentations/**").permitAll()
//                    .requestMatchers("/api/histories").permitAll()
//                    .requestMatchers(HttpMethod.POST,"/api/histories").permitAll()
//                    .requestMatchers(HttpMethod.POST,"/logout").permitAll()
////                    .requestMatchers("/api/users").permitAll()
////                    .requestMatchers(HttpMethod.POST,"/api/users").permitAll()
////                    .requestMatchers(HttpMethod.DELETE,"/api/users/**").permitAll()  // 開発用
//                    .anyRequest().authenticated()
//            })
//        httpSecurity.formLogin { form: FormLoginConfigurer<HttpSecurity?> ->
//            form
//                .loginProcessingUrl("/signin")
//                .loginPage("/signin")
//                .defaultSuccessUrl("/")
//        }
//        httpSecurity.logout {logout ->
//            logout.logoutSuccessUrl("/signin")
//        }
//        return httpSecurity.build()
//    }
//
////    @Bean
////    fun userDetailsManager(): InMemoryUserDetailsManager {
////        val username = "user"
////        val password = "pass"
////        val user = User.withUsername(username)
////            .password(
////                PasswordEncoderFactories
////                    .createDelegatingPasswordEncoder()
////                    .encode(password)
////            )
////            .roles("USER")
////            .build()
////        return InMemoryUserDetailsManager(user)
////    }
//
//
//}