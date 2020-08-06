<template>
    <div class="wrap" style="text-align: center;">
        <GuideBrowser/>
    </div>
    <!--    <div class="wrap" style="text-align: center;">-->
    <!--        <div style="text-align: right;width: 22em; display: inline-block;">-->
    <!--            <div v-for="ability in abilities" :key="ability.dataName">-->
    <!--                {{heroes.find(h => h.id === ability.heroId).name}} - {{ability.name}}-->
    <!--                <AbilityIcon :ability="ability" style="height: 2rem; width: auto;"/>-->
    <!--            </div>-->
    <!--        </div>-->
    <!--    </div>-->
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
    import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
    import MapTagVso from "@/js/vso/MapTagVso";
    import maps from "data/maps";
    import MapId from "data/MapId";

    const backend = new Backend(axios);

    export default {
        props: {},
        methods: {
            onSearch($event) {
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
                tag: new MapTagVso(
                    maps.get(MapId.HorizonLunarColony)
                ),
            };
        },
        components: {
            AbilityIcon,
            OverwatchButton,
            GuideBrowser,
            ThematicTagBadge,
        },
    };

</script>

<style scoped>
    .wrap {
    }
</style>
