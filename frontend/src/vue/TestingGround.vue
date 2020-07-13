<template>
    <div class="wrap">
        <GuideHeroTag
                :guide-hero-tag="tag"
        />
        <TagBuilder/>
    </div>
</template>

<script>
    import Backend from "../js/Backend";
    import axios from 'axios';
    import Topic from "../js/Topic";
    import heroes from "data/heroes";
    import TagBuilder from "@/vue/tags/TagBuilder";
    import GuideHeroTag from "@/vue/tags/GuideHeroTag";

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
                tag: {
                    playerHeroes: [heroes.get('pharah')],
                    allyHeroes: [heroes.get('lucio'), heroes.get('ana')],
                    enemyHeroes: [heroes.get('doomfist'), heroes.get('mei')],
                },
            };
        },
        components: {
            GuideHeroTag,
            TagBuilder,
        },
    };

</script>

<style scoped>
    .wrap {
    }
</style>
