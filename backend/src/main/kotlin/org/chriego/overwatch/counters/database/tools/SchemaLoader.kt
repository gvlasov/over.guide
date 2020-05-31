package org.chriego.overwatch.counters.database.tools

import org.chriego.overwatch.counters.database.Heroes
import org.chriego.overwatch.counters.database.MatchupEvaluations
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object SchemaLoader {

    fun load() {
        ConnectionCreator.connect()
        transaction {
            SchemaUtils.create(
                Heroes,
                MatchupEvaluations
            )
        }
    }

}