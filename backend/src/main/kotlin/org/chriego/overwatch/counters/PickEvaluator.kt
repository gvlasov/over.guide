package org.chriego.overwatch.counters

class PickEvaluator(
    private val counters: Counters
) {

    fun evaluate(pick: PickJson): PickEvaluationJson {
        val myHero = Hero.heroesByDataName[pick.myPick]!!
        val allyHeroes = pick.allyPicks.map { Hero.heroesByDataName[it]!! }
        val enemyHeroes = pick.enemyPicks.map { Hero.heroesByDataName[it]!! }
        val alternatives = Hero.values()
            .filter { it.role === myHero.role && !allyHeroes.contains(it) }
            .map { it to pickScore(enemyHeroes, it) }
            .sortedBy { it.second }
            .filter { !pick.bans.contains(it.first.dataName) }
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