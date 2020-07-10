<template>
    <div class="wrap">
        <MatchupEvaluator
                :subject="subject"
                :object="object"
        />
        <YoutubeVideo
                :video-id="'l_yKE4s-krk'"
                :start="0"
                :end="5"
                :loop="false"
                :autoplay="true"
                :width="300"
                style="pointer-events: none;"
        />
        <YoutubeVideo
                :video-id="'l_yKE4s-krk'"
                :start="1"
                :end="5"
                :loop="false"
                :autoplay="true"
                :width="300"
                style="pointer-events: none;"
        />
    </div>
</template>

<script>
    import Backend from "../js/Backend";
    import axios from 'axios';
    import Topic from "../js/Topic";
    import heroes from "data/heroes";
    import MatchupEvaluator from "@/vue/MatchupEvaluator";
    import YoutubeVideo from "@/vue/YoutubeVideo";

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
            YoutubeVideo,
            MatchupEvaluator,
        },
    };

</script>

<style scoped>
    .wrap {
        display: flex;
    }
</style>
