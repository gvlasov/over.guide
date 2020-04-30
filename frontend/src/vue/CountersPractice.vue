<template>
    <div>
        <Picks/>
        <Roster/>
    </div>
</template>

<script>
    import Picks from '../vue/Picks.vue';
    import Roster from '../vue/Roster.vue';

    export default {
        methods: {},
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
