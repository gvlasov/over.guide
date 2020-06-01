package org.chriego.overwatch.counters.database.tools

import org.chriego.overwatch.counters.Role
import org.chriego.overwatch.counters.database.Hero
import org.chriego.overwatch.counters.database.MatchupEvaluation
import org.jetbrains.exposed.sql.Transaction

object TestFixture : Fixture() {

    override fun Transaction.load() {
        val ana = Hero.new {
            name = "Ana"
            role = Role.Support
        }
        val reaper = Hero.new {
            name = "Reaper"
            role = Role.Damage
        }
        val reinhardt = Hero.new {
            name = "Reinhardt"
            role = Role.Tank
        }
        MatchupEvaluation.new {
            `object` = ana
            subject = reinhardt
            score = -4
            ip = "127.0.0.1"
        }
        MatchupEvaluation.new {
            `object` = ana
            subject = reaper
            score = 4
            ip = "127.0.0.1"
        }
        MatchupEvaluation.new {
            `object` = reaper
            subject = reinhardt
            score = 8
            ip = "127.0.0.1"
        }
    }

}