package org.chriego.overwatch.counters

data class Pick(
    val myPick: String,
    val allyPicks: List<String>,
    val enemyPicks: List<String>,
    val bans: List<String>,
    val map: String
)