package org.chriego.overwatch.counters

class App {
    val greeting: String
        get() {
            return "Hello world."
        }
}

fun main(args: Array<String>) {
    println(App().greeting)
}
