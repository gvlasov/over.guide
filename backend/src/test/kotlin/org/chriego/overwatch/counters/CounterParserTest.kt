package org.chriego.overwatch.counters

import org.junit.Test

internal class CounterParserTest {

    @Test
    fun smoke() {
        val table = CounterParser().parse()
        for (i in table.indices) {
            for (j in table[i].indices) {
                print(table[i][j])
            }
            println()
        }
    }

}