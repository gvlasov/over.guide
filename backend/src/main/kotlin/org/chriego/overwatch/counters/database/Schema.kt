package org.chriego.overwatch.counters.database

import org.chriego.overwatch.counters.Role
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.DriverManager

object Hero : IntIdTable() {
    val name = varchar("name", 32)
    val role = enumeration("role", Role::class)
    override val primaryKey = PrimaryKey(id)
}

object MatchupEvaluation : IntIdTable() {
    val subjectId = reference("subject_id", Hero.id)
    val objectId = reference("object_id", Hero.id)
    val score = integer("score")
}

fun main() {
    Database.connect(
        {
            DriverManager.getConnection(
                "jdbc:mariadb://localhost:3306/overwatch",
                "root",
                "1"
            )
        }
    )
    transaction {
        val tables = arrayOf(
            Hero,
            MatchupEvaluation
        )
        SchemaUtils.drop(*tables)
        SchemaUtils.create(*tables)
    }
}
