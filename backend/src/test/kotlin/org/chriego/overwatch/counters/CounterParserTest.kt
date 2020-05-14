package org.chriego.overwatch.counters

import org.junit.Test

internal class CounterParserTest {

    @Test
    fun smoke() {
        val table = CounterParser(
            "/org/chriego/overwatch/counters/counters.owc"
        ).parse()
        for (i in table.indices) {
            for (j in table[i].indices) {
                print(table[i][j])
            }
            println()
        }
    }

    @Test
    fun commands() {
        for (value in Hero.values()) {
            val name = value.dataName
            println("curl https://d1u1mce87gyfbn.cloudfront.net/hero/$name/hero-select-portrait.png > $name.png")
        }
    }

}