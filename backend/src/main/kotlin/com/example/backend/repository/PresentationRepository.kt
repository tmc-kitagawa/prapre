package com.example.backend.repository

import com.example.backend.dataclass.Presentation
import com.example.backend.dataclass.Request
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository
import java.sql.ResultSet

@Component
class PresentationRowMapper : RowMapper<Presentation> {
    override fun mapRow(rs: ResultSet, rowNum: Int): Presentation {
        return Presentation(
            rs.getLong(1),
            rs.getString(2),
            rs.getLong(3),
            rs.getLong(4),
            rs.getInt(5),
            rs.getInt(6),
            rs.getInt(7),
            rs.getInt(8),
            rs.getInt(9)
        )
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

    fun insertHistory(request: Request): String {
        jdbcTemplate.update("INSERT INTO presentations (id, title, starttime, user_id, score_eye, score_volume, score_filler, score_speed, score_time) VALUES (default, ?, ?, ?, ?, ?, ?, ?, ?)", request.title, request.startTime, request.userId,  request.scoreEye, request.scoreVolume, request.scoreFiller, request.scoreSpeed, request.scoreTime)
        return "insertHistory"
    }
}