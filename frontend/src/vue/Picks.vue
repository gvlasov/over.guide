<template>
    <div>
        <ul class="picks-list">
            <PlayerPick
                    v-for="hero in heroes"
                    :hero="hero"
            />
        </ul>
    </div>
</template>

<script>
    import HeroPortrait from "./HeroPortrait.vue";
    import PlayerPick from "./PlayerPick.vue";

    export default {
        props: {
            heroes: {
                type: Array,
                default() {
                    return [null, null, null, null, null, null];
                }
            }
        },
        methods: {},
        data() {
            return {
            }
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
    }
</style>
