package org.chriego.overwatch.counters

import org.chriego.overwatch.counters.database.Abilities
import org.chriego.overwatch.counters.database.Ability as AbilityDao

enum class Ability(
    val title: String,
    val hero: Hero,
    val description: String
) {
    BioticGrenade(
        "Biotic Grenade",
        Hero.Ana,
        "biotic grenade"
    ),
    SleepDart(
        "Sleep Dart",
        Hero.Ana,
        "after a short delay, fires a projectile that sleeps the target for 8 seconds upon impact"
    ),
    NanoBoost(
        "Nano Boost",
        Hero.Ana,
        "boosts a hero giving him +50% damage and 50% damage reduction"
    );

    val dataName: String
        get() =
            name
                .toLowerCase()
                .replace(Regex("[\\-\\d]+"), "")

    val dao: AbilityDao
        get() {
            return AbilityDao.find { Abilities.dataName eq dataName }.single()
        }

    fun createRecord(): AbilityDao {
        return AbilityDao.new {
            name = this@Ability.title
            dataName = this@Ability.dataName
            hero = this@Ability.hero.dao
        }
    }

}
