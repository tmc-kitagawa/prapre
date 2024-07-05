package com.example.backend.repository

import com.example.backend.dataclass.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

@Component
class UserRowMapper: RowMapper<User> {
    override fun mapRow(rs: ResultSet, rowNum: Int): User {
        return User(
            rs.getLong(1),
            rs.getString(2),
            rs.getString(3),
            rs.getBoolean(4)
        )
    }
}

@Repository
class UserRepository(
    @Autowired val jdbcTemplate: JdbcTemplate,
    @Autowired val userRowMapper: UserRowMapper
) {
    fun getUserId(name: String): Long {
        println(name)
        val sql = "SELECT * FROM users WHERE username = ?";
        val userRow = jdbcTemplate.query(sql, userRowMapper, name);
        return userRow[0].id
    }
}