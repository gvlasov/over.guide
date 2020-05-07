package org.chriego.overwatch.counters

class PickEvaluator(
    private val counters: Counters
) {

    fun evaluate(pick: Pick): PickEvaluation {
        return PickEvaluation(
            0,
            mapOf()
        )
    }

}