<template>
    <div>
        <ul class="picks-list">
            <PlayerPick
                    v-for="hero in teamComp.heroes"
                    :hero="hero"
            />
        </ul>
    </div>
</template>

<script>
    import HeroPortrait from "./HeroPortrait.vue";
    import PlayerPick from "./PlayerPick.vue";
    import TeamComp from "../js/TeamComp";

    export default {
        props: {
            teamComp: {
                type: TeamComp,
                default: () => TeamComp.empty()
            }
        },
        data() {
            return {};
        },
        components: {
            PlayerPick: PlayerPick,
            HeroPortrait: HeroPortrait
        },
    };

</script>

<style scoped>
    .picks-list {
        list-style: none;
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        user-select: none;
    }
</style>
