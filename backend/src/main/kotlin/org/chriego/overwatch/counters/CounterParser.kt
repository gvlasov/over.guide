package org.chriego.overwatch.counters

import java.util.*

class CounterParser(
    private val resourceName: String
) {

    fun parse(): Array<IntArray> {
        val table = prepareTable()
        val heroIds = Hero.heroIdsByName
        val resource = this::class.java.getResourceAsStream(resourceName)!!
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

}