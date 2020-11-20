import MatchupEvaluationVso from "@/ts/vso/MatchupEvaluationVso";
import debounce from 'lodash.debounce'
import Backend from "@/ts/Backend";
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";

export default class MatchupEvaluationBatcher {

    static debounceTimeMs = 400

    batch: MatchupEvaluationVso[] = []

    original: MatchupEvaluationVso[] = []

    sent: MatchupEvaluationVso[] = []

    sending: boolean = false


    add(evaluation: MatchupEvaluationVso) {
        const existingOriginal = this.original.find(
            (e) => e.opposition.left.id === evaluation.opposition.left.id
                && e.opposition.right.id === evaluation.opposition.right.id
        )
        if (existingOriginal === void 0) {
           this.original.push(
               new MatchupEvaluationVso(
                   evaluation.opposition,
                   MatchupEvaluatorService.instance.getScore(evaluation.opposition)
               )
           )
        }
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
            })
    }

    async undo() {
        this.batch.splice(0, this.batch.length, ...this.original)
        return this.sendDebounced(
            () => {
                this.sent.splice(0, this.send.length)
                this.original.splice(0, this.original.length)
            }
        )
    }
}

