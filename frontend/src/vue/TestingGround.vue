<template>
    <div class="wrap">
        <MatchupEvaluator
                :subject="subject"
                :object="object"
        />
    </div>
</template>

<script>
    import Backend from "../js/Backend";
    import axios from 'axios';
    import Topic from "../js/Topic";
    import heroes from "data/heroes";
    import MatchupEvaluator from "@/vue/MatchupEvaluator";

    const backend = new Backend(axios);

    export default {
        props: {},
        methods: {},
        data() {
            const subject = heroes.get('pharah');
            const object = heroes.get('mei');
            return {
                subject: subject,
                object: object,
                topic: new Topic([subject, object]),
            };
        },
        components: {
            MatchupEvaluator,
        },
    };

</script>

<style scoped>
    .wrap {
        display: flex;
    }
</style>
