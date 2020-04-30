<template>
    <div>
        <Picks/>
        <Roster/>
    </div>
</template>

<script>
    var Hero = require('../js/Hero.js');
    var _ = require('lodash');
    module.exports = {
        methods: {},
        data() {
            const self = this;
            return {}
        },
        components: {
            Picks: require('../vue/Picks.vue'),
            Roster: require('../vue/Roster.vue'),
        },
    };

</script>

<style scoped>

</style>
