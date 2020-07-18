<template>
    <div class="wrap">
        asd;lfkjasd;lfkjasd;flkajsd;flkasjdf;lkasdjf
        <OverwatchButton :type="'main'" style="position: relative; left: -200px;">hello</OverwatchButton>
        <OverwatchButton :type="'default'" disabled="disabled">hello</OverwatchButton>
    </div>
</template>

<script>
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import Topic from "@/js/Topic";
    import heroes from "data/heroes";
    import OverwatchButton from "@/vue/OverwatchButton";

    const backend = new Backend(axios);

    export default {
        props: {},
        methods: {
            onSearch($event) {
                console.log($event);
            }
        },
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
            OverwatchButton,
        },
    };

</script>

<style scoped>
    .wrap {
    }
</style>
