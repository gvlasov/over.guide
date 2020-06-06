package org.chriego.overwatch.counters.database.tools

import org.chriego.overwatch.counters.Role
import org.chriego.overwatch.counters.database.*
import org.jetbrains.exposed.sql.Transaction
import java.time.LocalDate

object TestFixture : Fixture() {

    override fun Transaction.load() {
        val overwatchAnniversaryPatch = Patch.new {
            version = "1.40"
            title = "Overwatch Anniversary"
            date = LocalDate.of(2020, 5, 19)
        }
        val winterMadnessPatch = Patch.new {
            version = "1.39"
            title = "Winter Madness"
            date = LocalDate.of(2020, 2, 10)
        }
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
        val anaReinEval = MatchupEvaluation.new {
            `object` = ana
            subject = reinhardt
            score = -4
            ip = "127.0.0.1"
            patch = overwatchAnniversaryPatch
        }
        MatchupEvaluation.new {
            `object` = ana
            subject = reaper
            score = 4
            ip = "127.0.0.1"
            patch = overwatchAnniversaryPatch
        }
        MatchupEvaluation.new {
            `object` = reaper
            subject = reinhardt
            score = 8
            ip = "127.0.0.1"
            patch = winterMadnessPatch
        }
        val bioticGrenade = Ability.new {
            name = "Biotic grenade"
            hero = ana
        }
        val sleepDart = Ability.new {
            name = "Sleep dart"
            hero = ana
        }
        val anaReinGrenadeEval = AbilityUseEvaluation.new {
            ability = bioticGrenade
            `object` = reinhardt
            description = "Watch rein to lower his shield"
        }
    }

}