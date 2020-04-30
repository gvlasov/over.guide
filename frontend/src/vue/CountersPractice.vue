<template>
    <div>
        <Picks
                ref="picks"
                v-on:click.native="nextPick"
        />
        <Roster
                ref="roster"
        />
    </div>
</template>

<script>
    import Picks from '../vue/Picks.vue';
    import Roster from '../vue/Roster.vue';

    export default {
        methods: {
            nextPick() {
                this.$refs.picks.shuffle();
            }
        },
        data() {
            const self = this;
            return {}
        },
        components: {
            Picks: Picks,
            Roster: Roster,
        },
    };

</script>

<style scoped>

</style>
