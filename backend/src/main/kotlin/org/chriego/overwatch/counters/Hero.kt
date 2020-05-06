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

}
