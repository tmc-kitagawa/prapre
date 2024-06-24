package com.example.backend.repository

import com.example.backend.dataclass.Presentation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository
import java.sql.ResultSet

@Component
class PresentationRowMapper : RowMapper<Presentation> {
    override fun mapRow(rs: ResultSet, rowNum: Int): Presentation {
        return Presentation(rs.getLong(1), rs.getString(2), rs.getLong(3), rs.getInt(4))
    }
}

@Repository
class PresentationRepository(
    @Autowired val jdbcTemplate: JdbcTemplate,
    @Autowired val presentationRowMapper: PresentationRowMapper
) {
    fun getPresentations(): List<Presentation> {
        return jdbcTemplate.query("SELECT * FROM presentations", presentationRowMapper)
    }
}