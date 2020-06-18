<template>
    <div
            class="all"
            @click="evaluateMatchup"
    >
        <PlayerPick
                :hero="subject"
        />
        <div v-if="evaluation !== null" class="wrap">
            <div v-for="abilityEvaluation in evaluation.abilityUses">
                <h3>{{ abilityEvaluation.abilityName }}</h3>
                <div>{{ abilityEvaluation.description }}</div>
            </div>
        </div>
        <div class="wrap" style="width: 30vw;">
            <TopicComments :topic="topic"/>
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
    import TopicComments from "./TopicComments.vue";
    import Topic from "../js/Topic";

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
        display: inline-block;
    }

    .all > * {
        vertical-align: top;
    }

</style>
