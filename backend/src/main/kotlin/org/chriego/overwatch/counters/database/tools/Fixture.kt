package org.chriego.overwatch.counters.database.tools

import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.transaction

abstract class Fixture {

    protected abstract fun Transaction.load()

    fun run() {
        ConnectionCreator.connect()
        transaction {
            load()
        }
    }


}

