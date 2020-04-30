<template>
    <div>
        <h1 class="overwatch-font-shadowed">Overwatch Counters</h1>
        <CountersPractice/>
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
            CountersPractice: require('../vue/CountersPractice.vue'),
        },
    }
</script>

<style scoped>
</style>
