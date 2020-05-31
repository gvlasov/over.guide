package org.chriego.overwatch.counters.database.tools

import org.jetbrains.exposed.sql.Database
import java.sql.DriverManager
import java.util.*

object ConnectionCreator {
    fun connect() {
        val properties = Properties()
            .apply {
                load(
                    ConnectionCreator::class.java.getResourceAsStream("/db.properties")
                )
            }
        Database.connect(
            {
                DriverManager.getConnection(
                    properties.getProperty("db.dsn"),
                    properties.getProperty("db.user"),
                    properties.getProperty("db.password")
                )
            }
        )
    }
}