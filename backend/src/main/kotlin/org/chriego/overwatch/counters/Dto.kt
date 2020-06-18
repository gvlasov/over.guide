package org.chriego.overwatch.counters

import org.chriego.overwatch.counters.database.AbilityCounterEvaluation
import org.chriego.overwatch.counters.database.AbilityUseEvaluation
import org.chriego.overwatch.counters.database.MatchupEvaluation
import org.chriego.overwatch.counters.database.YoutubeVideoExcerpt

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

class YoutubeVideoExcerptJson(
    excerpt: YoutubeVideoExcerpt
) {
    val videoId = excerpt.videoId
    val startSeconds = excerpt.startSeconds
    val endSeconds = excerpt.endSeconds
}