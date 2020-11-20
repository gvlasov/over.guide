import MatchupEvaluationVso from "@/ts/vso/MatchupEvaluationVso";
import debounce from 'lodash.debounce'
import Backend from "@/ts/Backend";
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";

export default class MatchupEvaluationBatcher {

    static debounceTimeMs = 400

    batch: MatchupEvaluationVso[] = []

    sent: MatchupEvaluationVso[] = []

    sending: boolean = false


    add(evaluation: MatchupEvaluationVso) {
        const existingEvaluationIndex = this.batch.findIndex(
            (e) => e.opposition.left.id === evaluation.opposition.left.id
                && e.opposition.right.id === evaluation.opposition.right.id
        )
        if (existingEvaluationIndex !== -1) {
            this.batch.splice(existingEvaluationIndex, 1, evaluation)
        } else {
            this.batch.push(evaluation)
        }
    }

    readonly sendDebounced: (onComplete: () => void) => Promise<void> =
        debounce(
            (onComplete) => {
                return this.send()
                    .then(() => {
                        onComplete()
                    })
            },
            MatchupEvaluationBatcher.debounceTimeMs
        )

    private async send(): Promise<void> {
        if (this.sending) {
            throw new Error()
        }
        this.sending = true
        return Backend.instance.evaluateMatchups(this.batch)
            .then(() => {
                for (let evaluation of this.batch) {
                    MatchupEvaluatorService.instance.cacheEvaluation(
                        evaluation
                    )
                }
                this.sent.push(...this.batch)
                this.batch.splice(0, this.batch.length)
                this.sending = false
                console.log('then')
            })
    }

    async undo() {
        return Backend.instance.removeMatchupEvaluations(
            this.sent.map(e => e.opposition)
        )
    }
}

