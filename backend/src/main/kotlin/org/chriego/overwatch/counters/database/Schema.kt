package org.chriego.overwatch.counters.database

import org.chriego.overwatch.counters.Role
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.`java-time`.date

object Heroes : IntIdTable() {
    val name = varchar("name", 32)
    val role = enumeration("role", Role::class)
    override val primaryKey = PrimaryKey(id)
}

class Hero(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Hero>(Heroes)

    var name by Heroes.name
    var role by Heroes.role
}

object MatchupEvaluations : IntIdTable() {
    val subjectId = reference("subject_id", Heroes.id)
    val objectId = reference("object_id", Heroes.id)
    val score = integer("score")
    val ip = varchar("ip", 14)
    val patchId = reference("patch", Patches.id)
}

class MatchupEvaluation(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MatchupEvaluation>(MatchupEvaluations)

    var subject by Hero referencedOn MatchupEvaluations.subjectId
    var `object` by Hero referencedOn MatchupEvaluations.objectId
    var score by MatchupEvaluations.score
    var ip by MatchupEvaluations.ip
    var patch by Patch referencedOn MatchupEvaluations.patchId
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
