package org.chriego.overwatch.counters

import java.util.*
import kotlin.collections.LinkedHashMap

class CounterParser {

    fun parse(): Array<IntArray> {
        val table = prepareTable()
        val heroIds = prepareHeroIds()
        val resource = this::class.java.getResourceAsStream("/org/chriego/overwatch/counters/counters.owc")!!
        val scanner =
            Scanner(resource, "UTF-8")
                .useDelimiter("\n")

        while (scanner.hasNext()) {
            val next = scanner
                .next()
            val split = next
                .split(delimiters = *charArrayOf(' '))
            val myHeroId = heroIds[split[0]]!!
            val theirHeroId = heroIds[split[1]]!!
            val rating = decodeRating(split[2])
            println("$myHeroId $theirHeroId $rating")
            println("${split[0]} ${split[1]} ${split[2]}")
            table[myHeroId][theirHeroId] = rating
        }
        validate(table)
        return table
    }

    private fun validate(
        table: Array<IntArray>
    ) {
        for (i in table.indices) {
            for (j in table[i].indices) {
                if (table[i][j] != -table[j][i]) {
                    throw IllegalStateException(
                        "$i $j === ${table[i][j]}, but $j $i === ${table[j][i]}"
                    )
                }
            }
        }
    }

    private fun decodeRating(ratingText: String): Int =
        when (ratingText) {
            "+" -> 4
            "++" -> 8
            "-" -> -4
            "--" -> -8
            else -> throw IllegalArgumentException()
        }

    private fun prepareTable(): Array<IntArray> {
        val size = Hero.values().size
        return Array(size) { IntArray(size) { 0 } }
    }

    private fun prepareHeroIds(): Map<String, Int> {
        val size = Hero.values().size
        val map = LinkedHashMap<String, Int>(size)
        for (indexed in Hero.values().withIndex()) {
            val heroDataName = indexed.value.name.toLowerCase().replace(Regex("[\\-\\d]+"), "")
            map[heroDataName] = indexed.index
        }
        return map
    }

}