package org.chriego.overwatch.counters

class PickEvaluator(
    private val counters: Counters
) {

    fun evaluate(pick: Pick): PickEvaluation {
        val myHero = Hero.heroesByDataName[pick.myPick]!!
        val allyHeroes = pick.allyPicks.map { Hero.heroesByDataName[it]!! }
        val enemyHeroes = pick.enemyPicks.map { Hero.heroesByDataName[it]!! }
        val alternatives = Hero.values()
            .filter { it.role === myHero.role }
            .map { it to pickScore(enemyHeroes, it) }
            .sortedBy { it.second }
            .filter { it.first !== myHero && !pick.bans.contains(it.first.dataName) }
            .takeLast(3)
            .map { it.first.dataName to it.second }
        return PickEvaluation(
            pickScore(enemyHeroes, myHero),
            alternatives.toMap()
        )
    }

    private fun pickScore(enemyHeroes: List<Hero>, hero: Hero): Int =
        enemyHeroes
            .map { enemy -> counters.evaluate(hero, enemy) }
            .sum()

}