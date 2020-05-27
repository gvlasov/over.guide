package org.chriego.overwatch.counters

class PickEvaluator(
    private val counters: Counters
) {

    fun evaluate(pickInContext: PickContextJson): PickEvaluationJson {
        val allyHeroes = pickInContext.allyComp.map { Hero.heroesByDataName[it]!! }
        val enemyHeroes = pickInContext.enemyComp.map { Hero.heroesByDataName[it]!! }
        val missingRole = getMissingRole(allyHeroes)
        val alternatives = Hero.values()
            .filter { it.role === missingRole && !allyHeroes.contains(it) }
            .map { it to pickScore(enemyHeroes, it) }
            .sortedBy { it.second }
            .map { it.first.dataName to it.second }
        return PickEvaluationJson(
            alternatives.map {
                AlternativeJson(it.first, it.second)
            }
        )
    }

    private fun getMissingRole(allyHeroes: List<Hero>): Role {
        var tanks = 0
        var damage = 0
        var support = 0
        for (hero in allyHeroes) {
            if (hero.role === Role.Tank) {
                tanks++
            } else if (hero.role === Role.Damage) {
                damage++
            } else if (hero.role === Role.Support) {
                support++
            }
        }
        if (tanks == 1) {
            if (damage != 2 || support != 2) {
                throw IllegalArgumentException("Wrong team comp: $allyHeroes")
            }
            return Role.Tank
        } else if (damage == 1) {
            if (tanks != 2 || support != 2) {
                throw IllegalArgumentException("Wrong team comp: $allyHeroes")
            }
            return Role.Damage
        } else if (support == 1) {
            if (tanks != 2 || damage != 2) {
                throw IllegalArgumentException("Wrong team comp: $allyHeroes")
            }
            return Role.Support
        }
        throw IllegalArgumentException("Wrong team comp: $allyHeroes")
    }

    private fun pickScore(enemyHeroes: List<Hero>, hero: Hero): Int =
        enemyHeroes
            .map { enemy -> counters.evaluate(hero, enemy) }
            .sum()

}