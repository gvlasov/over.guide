package org.chriego.overwatch.counters

data class AlternativeJson(
    val dataName: String,
    val score: Int
)

data class PickEvaluationJson(
    val alternatives: List<AlternativeJson>
)

data class PickJson(
    val myPick: String,
    val allyPicks: List<String>,
    val enemyPicks: List<String>,
    val bans: List<String>,
    val map: String
)