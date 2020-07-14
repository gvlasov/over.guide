<template>
    <div
            class="wrap"
    >
        <PlayerPick :hero="subject"/>
        <div>
            <div
                    class="option matchup-hard-counters"
                    @click="evaluateHardCounter"
            >hard counters
            </div>
            <div
                    class="option matchup-counters"
                    @click="evaluateCounter"
            >counters
            </div>
            <div
                    class="option matchup-ok"
                    @click="evaluateOk"
            >is ok against
            </div>
            <div
                    class="option matchup-countered"
                    @click="evaluateCountered"
            >is countered by
            </div>
            <div
                    class="option matchup-hard-countered"
                    @click="evaluateHardCountered"
            >is hard countered by
            </div>
        </div>
        <PlayerPick :hero="object"/>
    </div>
</template>

<script>
    import PlayerPick from "@/vue/training/PlayerPick.vue";
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import TopicComments from "@/vue/TopicComments.vue";
    import Topic from "@/js/Topic";

    const backend = new Backend(axios);

    export default {
        props: {
            subject: Object,
            object: Object,
        },
        methods: {
            evaluateHardCounters() {
                return this.createEvaluation(8);
            },
            evaluateCounters() {
                return this.createEvaluation(4);
            },
            evaluateOk() {
                return this.createEvaluation(0);
            },
            evaluateCountered() {
                return this.createEvaluation(-4);
            },
            evaluateHardCountered() {
                return this.createEvaluation(-8);
            },
            /**
             * @param {number} power
             */
            createEvaluation(power) {
                backend
                    .evaluateMatchup(
                        this.subject,
                        this.object,
                        power
                    )
                    .then(result => {
                        console.log('evaluated')
                    });
            }
        },
        data() {
            return {
                evaluation: null,
                topic: new Topic([this.subject, this.object]),
            };
        },
        components: {
            TopicComments,
            PlayerPick: PlayerPick
        },
    };

</script>

<style scoped>
    .wrap {
        display: flex;
    }

    .option {
        cursor: pointer;
        font-size: 1.5em;
        margin: .3em;
        padding: .2em;
    }

    .matchup-hard-countered {
        background-color: hsl(0, 69%, 44%);
    }

    .matchup-countered {
        background-color: hsl(0, 29%, 59%);
    }

    .matchup-ok {
        background-color: hsl(40, 69%, 80%);
    }

    .matchup-counters {
        background-color: hsl(50, 69%, 44%);
    }

    .matchup-hard-counters {
        background-color: hsl(60, 69%, 44%);
    }
</style>
