package org.chriego.overwatch.counters

data class PickEvaluation(
    val score: Int,
    val alternatives: Map<Hero, Int>
)