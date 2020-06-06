<template>
    <div

            @click="evaluateMatchup"
    >
        <PlayerPick
                :hero="subject"
        />
        <div v-if="evaluation !== null">
            <div v-for="abilityEvaluation in evaluation.abilityUses">
                <h3>{{ abilityEvaluation.abilityName }}</h3>
                <div>{{ abilityEvaluation.description }}</div>
            </div>
        </div>
        <PlayerPick
                :hero="object"
        />
    </div>
</template>

<script>
    import PlayerPick from "./PlayerPick.vue";
    import Hero from "../js/Hero";
    import Backend from "../js/Backend";
    import axios from 'axios';
    import env from '../../build/env.js'

    let backendUrl = window.location.protocol + "//" + window.location.hostname + ":" + env.BACKEND_PORT;
    const backend = new Backend(axios, backendUrl);

    export default {
        props: {
            subject: Hero,
            object: Hero
        },
        methods: {
            evaluateMatchup() {
                const self = this;
                this.evaluation =
                    backend
                        .evaluateMatchup(this.subject, this.object)
                        .then(evaluation => {
                            self.evaluation = evaluation;
                            console.log(self.evaluation);
                        });
            }
        },
        data() {
            return {
                evaluation: null
            };
        },
        components: {
            PlayerPick: PlayerPick
        },
    };

</script>

<style scoped>
</style>
