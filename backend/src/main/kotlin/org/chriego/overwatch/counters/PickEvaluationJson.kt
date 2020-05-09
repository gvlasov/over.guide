package org.chriego.overwatch.counters

data class PickEvaluationJson(
    val score: Int,
    val alternatives: Map<String, Int>
)