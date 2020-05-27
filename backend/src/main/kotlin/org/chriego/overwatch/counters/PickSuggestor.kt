package org.chriego.overwatch.counters

class PickSuggestor(
    private val counters: Counters
) {

    fun evaluate(pickInContext: PickInContextJson): PickEvaluationJson {
        val myHero = Hero.heroesByDataName[pickInContext.myPick]!!
        val allyHeroes = pickInContext.allyComp.map { Hero.heroesByDataName[it]!! }
        val enemyHeroes = pickInContext.enemyComp.map { Hero.heroesByDataName[it]!! }
        val alternatives = Hero.values()
            .filter { it.role === myHero.role && !allyHeroes.contains(it) }
            .map { it to pickScore(enemyHeroes, it) }
            .sortedBy { it.second }
            .map { it.first.dataName to it.second }
        return PickEvaluationJson(
            alternatives.map {
                AlternativeJson(it.first, it.second)
            }
        )
    }

    private fun pickScore(enemyHeroes: List<Hero>, hero: Hero): Int =
        enemyHeroes
            .map { enemy -> counters.evaluate(hero, enemy) }
            .sum()

}