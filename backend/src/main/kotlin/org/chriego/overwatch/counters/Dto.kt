package org.chriego.overwatch.counters

data class AlternativeJson(
    val dataName: String,
    val score: Int
)

data class PickEvaluationJson(
    val alternatives: List<AlternativeJson>
)

data class PickInContextJson(
    val myPick: String,
    val allyComp: List<String>,
    val enemyComp: List<String>,
    val bans: List<String>,
    val map: String
)