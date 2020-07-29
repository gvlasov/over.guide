<template>
    <div class="wrap" style="text-align: center;">
        <div style="text-align: right;width: 22em; display: inline-block;">
            <!--        <GuideBrowser />-->
            <div v-for="ability in abilities" :key="ability.dataName">
                {{heroes.find(h => h.id === ability.heroId).name}} - {{ability.name}}
                <AbilityIcon :ability="ability" style="height: 2rem; width: auto;"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import Topic from "@/js/Topic";
    import heroes from "data/heroes";
    import abilities from "data/abilities";
    import OverwatchButton from "@/vue/OverwatchButton";
    import GuideBrowser from "@/vue/guides/GuideBrowser";
    import AbilityIcon from "@/vue/AbilityIcon";

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
                abilities: Array.from(abilities.values()),
                heroes: Array.from(heroes.values()),
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
            AbilityIcon,
            OverwatchButton,
            GuideBrowser,
        },
    };

</script>

<style scoped>
    .wrap {
    }
</style>
