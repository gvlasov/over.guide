package org.chriego.overwatch.counters.database

import org.chriego.overwatch.counters.Role
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

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
}

class MatchupEvaluation(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MatchupEvaluation>(MatchupEvaluations)

    var subject by Hero referencedOn MatchupEvaluations.subjectId
    var `object` by Hero referencedOn MatchupEvaluations.objectId
    var score by MatchupEvaluations.score
}
