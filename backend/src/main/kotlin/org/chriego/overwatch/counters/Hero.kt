package org.chriego.overwatch.counters

import org.chriego.overwatch.counters.Role.*

enum class Hero(
    role: Role,
    val fullName: String? = null
) {

    Ana(Support),
    Ashe(Damage),
    Baptiste(Support),
    Bastion(Damage),
    Brigitte(Support),
    Dva(Tank),
    Doomfist(Damage),
    Echo(Damage),
    Genji(Damage),
    Hanzo(Damage),
    Junkrat(Damage),
    Lucio(Support),
    McCree(Damage),
    Mercy(Support),
    Mei(Damage),
    Moira(Support),
    Orisa(Tank),
    Pharah(Damage),
    Reaper(Damage),
    Reinhardt(Tank),
    Roadhog(Tank),
    Sigma(Tank),
    Soldier76(Damage, "Soldier: 76"),
    Sombra(Damage),
    Symmetra(Damage),
    Torbjorn(Damage),
    Tracer(Damage),
    Widowmaker(Damage),
    Winston(Tank),
    WreckingBall(Tank, "Wrecking Ball"),
    Zarya(Tank),
    Zenyatta(Support)
    ;

    companion object {

        val heroIdsByName: Map<String, Int> by lazy {
            val values = Hero.values()
            val size = values.size
            val map = LinkedHashMap<String, Int>(size)
            for (indexed in values.withIndex()) {
                val heroDataName = indexed.value.jsonName
                map[heroDataName] = indexed.index
            }
            map
        }

        val heroesByJsonName: Map<String, Hero> by lazy {
            val values = Hero.values()
            val size = values.size
            val map = LinkedHashMap<String, Hero>(size)
            for (hero in values) {
                map[hero.jsonName] = hero
            }
            map
        }

    }

    val jsonName: String
        get() =
            name
                .toLowerCase()
                .replace(Regex("[\\-\\d]+"), "")

    val id: Int
        get() =
            heroIdsByName[jsonName]!!

}
