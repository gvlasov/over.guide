import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.ContentNegotiation
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.chriego.overwatch.counters.CounterParser
import org.chriego.overwatch.counters.Counters
import org.chriego.overwatch.counters.Pick
import org.chriego.overwatch.counters.PickEvaluator

fun main(args: Array<String>) {
    val server = embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            jackson {
            }
        }
        routing {
            get("/evaluate-pick") {
                val pick = call.receive<Pick>()
                val evaluator = PickEvaluator(
                    Counters(
                        CounterParser(
                            "/org/chriego/overwatch/counters/counters.owc"
                        )
                    )
                )
                call.respond(evaluator.evaluate(pick))
            }
            get("/demo") {
                call.respondText("HELLO WORLD!")
            }
        }

    }
    server.start(wait = true)
}