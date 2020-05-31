package org.chriego.overwatch.counters
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.ContentNegotiation
import io.ktor.http.HttpMethod
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.header
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.options
import io.ktor.routing.post
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

fun main(args: Array<String>) {
    val server = embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        install(ContentNegotiation) {
            jackson {
            }
        }
        install(CORS) {
            method(HttpMethod.Options)
            anyHost()
            allowNonSimpleContentTypes = true
        }
        routing {
            options {
                call.response.header("Access-Control-Allow-Origin", "*")
                call.respond(200)
            }
            post("/suggest-pick") {
                val pick = call.receive<PickContextJson>()
                val suggestor = PickSuggestor(
                    Counters(
                        CounterParser(
                            "/org/chriego/overwatch/counters/counters.owc"
                        )
                    )
                )
                call.respond(suggestor.suggest(pick))
            }
            get("/demo") {
                call.respondText("HELLO WORLD!")
            }
        }

    }
    server.start(wait = true)
}