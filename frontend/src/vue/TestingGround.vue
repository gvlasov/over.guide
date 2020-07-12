<template>
    <div class="wrap">
        <TagBuilder/>
    </div>
</template>

<script>
    import Backend from "../js/Backend";
    import axios from 'axios';
    import Topic from "../js/Topic";
    import heroes from "data/heroes";
    import TagBuilder from "@/vue/TagBuilder";

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
            TagBuilder,
        },
    };

</script>

<style scoped>
    .wrap {
    }
</style>
