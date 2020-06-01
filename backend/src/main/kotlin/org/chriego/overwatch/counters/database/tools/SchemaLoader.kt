package org.chriego.overwatch.counters.database.tools

import org.chriego.overwatch.counters.database.Heroes
import org.chriego.overwatch.counters.database.MatchupEvaluations
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object SchemaLoader {
    val tables = arrayOf(Heroes, MatchupEvaluations)

    fun load() {
        ConnectionCreator.connect()
        transaction {
            SchemaUtils.createMissingTablesAndColumns(*tables)
        }
    }

    fun loadClean() {
        ConnectionCreator.connect()
        transaction {
            SchemaUtils.drop(*tables)
            SchemaUtils.create(*tables)
        }
    }

}