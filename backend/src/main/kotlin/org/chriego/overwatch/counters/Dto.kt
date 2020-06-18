package org.chriego.overwatch.counters

import org.chriego.overwatch.counters.database.AbilityCounterEvaluation
import org.chriego.overwatch.counters.database.AbilityUseEvaluation
import org.chriego.overwatch.counters.database.MatchupEvaluation
import org.chriego.overwatch.counters.database.YoutubeVideoExcerpt

class EntityValidationException(message: String) : RuntimeException(message)
data class AlternativeJson(
    val dataName: String,
    val score: Int
)

data class PickSuggestionJson(
    val alternatives: List<AlternativeJson>
)

data class PickContextJson(
    val allyComp: List<String>,
    val enemyComp: List<String>,
    val bans: List<String>,
    val map: String
)

class AbilityUseEvaluationJson(
    abilityUseEvaluation: AbilityUseEvaluation
) {
    val ability: String = abilityUseEvaluation.ability.name
    val `object`: String = abilityUseEvaluation.`object`.dataName
    val description: String = abilityUseEvaluation.description
}

class AbilityCounterEvaluationJson(
    abilityCounterEvaluation: AbilityCounterEvaluation
) {
    val ability: String = abilityCounterEvaluation.ability.name
    val `object`: String = abilityCounterEvaluation.`object`.dataName
    val description: String = abilityCounterEvaluation.description
}

class MatchupEvaluationJson(
    matchupEvaluation: MatchupEvaluation
) {
    val subject: String = matchupEvaluation.subject.dataName
    val `object`: String = matchupEvaluation.`object`.dataName
    val score: Int = matchupEvaluation.score
    val abilityUses: List<AbilityUseEvaluationJson> =
        matchupEvaluation.abilityUseEvaluations.map {
            AbilityUseEvaluationJson(it)
        }
    val abilityCounters: List<AbilityCounterEvaluationJson> =
        matchupEvaluation.abilityCounterEvaluations.map {
            AbilityCounterEvaluationJson(it)
        }
}

data class YoutubeVideoExcerptJson(
    val videoId: String,
    val startSeconds: Float,
    val endSeconds: Float
) {
    companion object {
        fun fromEntity(
            excerpt: YoutubeVideoExcerpt
        ): YoutubeVideoExcerptJson =
            YoutubeVideoExcerptJson(
                excerpt.videoId,
                excerpt.startSeconds,
                excerpt.endSeconds
            )
    }

    fun validate() {
        if (startSeconds >= endSeconds) {
            throw EntityValidationException(
                "Start seconds must be < endSeconds; startSeconds = $startSeconds, endSeconds = $endSeconds"
            )
        }
    }

}