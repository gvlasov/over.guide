package org.chriego.overwatch.counters.database

import org.chriego.overwatch.counters.Role
import org.chriego.overwatch.counters.YoutubeVideoExcerptJson
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.`java-time`.date
import org.jetbrains.exposed.sql.select

object Heroes : IntIdTable() {
    val name = varchar("name", 32)
    val dataName = varchar("data_name", 32)
    val role = enumeration("role", Role::class)
    override val primaryKey = PrimaryKey(id)
}

class Hero(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Hero>(Heroes)

    var name by Heroes.name
    var dataName by Heroes.dataName
    var role by Heroes.role
}

object MatchupEvaluations : IntIdTable() {
    val subjectId = reference("subject_id", Heroes.id)
    val objectId = reference("object_id", Heroes.id)
    val score = integer("score")
    val ip = varchar("ip", 14)
    val patchId = reference("patch_id", Patches.id)
}

class MatchupEvaluation(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MatchupEvaluation>(MatchupEvaluations)

    var subject by Hero referencedOn MatchupEvaluations.subjectId
    var `object` by Hero referencedOn MatchupEvaluations.objectId
    var score by MatchupEvaluations.score
    var ip by MatchupEvaluations.ip
    var patch by Patch referencedOn MatchupEvaluations.patchId
    val abilityUseEvaluations: List<AbilityUseEvaluation>
        get() {
            return AbilityUseEvaluation
                .wrapRows(
                    AbilityUseEvaluations
                        .innerJoin(Heroes)
                        .select { Heroes.id eq subject.id }
                )
                .toList()
        }
    val abilityCounterEvaluations: List<AbilityCounterEvaluation>
        get() {
            return AbilityCounterEvaluation
                .wrapRows(
                    AbilityCounterEvaluations
                        .innerJoin(Heroes)
                        .select { Heroes.id eq subject.id }
                )
                .toList()
        }
}

object Patches : IntIdTable() {
    val version = varchar("version", 12)
    val date = date("date")
    val title = varchar("title", 30).nullable()
}

class Patch(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Patch>(Patches)

    var version by Patches.version
    var date by Patches.date
    var title by Patches.title
}

object Abilities : IntIdTable() {
    val name = varchar("name", 32)
    val dataName = varchar("data_name", 32)
    val heroId = reference("hero_id", Heroes.id)
    val removedAtPatchId = reference("removed_at_version_id", Patches.id).nullable()
}

class Ability(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Ability>(Abilities)

    var name by Abilities.name
    var dataName by Abilities.dataName
    var hero by Hero referencedOn Abilities.heroId
    var removedAtPatch by Patch optionalReferencedOn Abilities.removedAtPatchId
}

object AbilityUseEvaluations : IntIdTable() {
    val abilityId = reference("ability_id", Abilities.id)
    val objectId = reference("object_id", Heroes.id)
    val description = text("description")
}

class AbilityUseEvaluation(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AbilityUseEvaluation>(AbilityUseEvaluations)

    var ability by Ability referencedOn AbilityUseEvaluations.abilityId
    var `object` by Hero referencedOn AbilityUseEvaluations.objectId
    var description by AbilityUseEvaluations.description

}

object AbilityCounterEvaluations : IntIdTable() {
    val abilityId = reference("ability_id", Abilities.id)
    val objectId = reference("object_id", Heroes.id)
    val description = text("description")
}

class AbilityCounterEvaluation(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AbilityCounterEvaluation>(AbilityCounterEvaluations)

    var ability by Ability referencedOn AbilityCounterEvaluations.abilityId
    var `object` by Hero referencedOn AbilityCounterEvaluations.objectId
    var description by AbilityCounterEvaluations.description

}

object YoutubeVideoExcerpts : IntIdTable() {
    val videoId = varchar("video_id", 16)
    val startSeconds = float("start_seconds")
    val endSeconds = float("end_seconds")
}

class YoutubeVideoExcerpt(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<YoutubeVideoExcerpt>(YoutubeVideoExcerpts) {

        fun newFromJson(json: YoutubeVideoExcerptJson): YoutubeVideoExcerpt {
            return YoutubeVideoExcerpt.new {
                videoId = json.videoId
                startSeconds = json.startSeconds
                endSeconds = json.endSeconds
            }
        }

    }

    var videoId by YoutubeVideoExcerpts.videoId
    var startSeconds by YoutubeVideoExcerpts.startSeconds
    var endSeconds by YoutubeVideoExcerpts.endSeconds

}

