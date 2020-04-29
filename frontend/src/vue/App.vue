<template>
    <div>
        <h1 class="overwatch-font-shadowed">Overwatch Counters</h1>
        <Picks></Picks>
        <!--        <Roster :on-hero-click="heroTest"/>-->
    </div>
</template>

<script>
    module.exports = {
        methods: {
            /**
             * @param {Hero} hero
             * @return {string}
             */
            heroTest: function (hero) {
                alert(hero.name);
            }
        },
        components: {
            Picks: require('../vue/Picks.vue'),
            Roster: require('../vue/Roster.vue'),
        },
    }
</script>

<style scoped>
</style>
