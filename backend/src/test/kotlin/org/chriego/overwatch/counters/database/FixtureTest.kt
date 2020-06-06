package org.chriego.overwatch.counters.database

import org.chriego.overwatch.counters.database.tools.SchemaLoader
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Before
import org.junit.Test

class FixtureTest {

    @Before
    fun before() {
        SchemaLoader.loadClean()
    }

    @Test
    fun testFixture() {
        TestFixture.run()
        transaction {
            MatchupEvaluation.all()
                .forEach {
                    println("${it.patch.title}")
                }
        }
    }

}