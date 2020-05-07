package org.chriego.overwatch.counters

class Counters(
    parser: CounterParser
) {
    private val table = parser.parse()

    fun evaluate(my: Hero, their: Hero): Int {
        return table[my.id][their.id]
    }


}