<template>
    <div>
        <h1 class="overwatch-font-shadowed">Overwatch Counters</h1>
        <!--        <Picks></Picks>-->
        <Roster/>
    </div>
</template>

<script>
    module.exports = {
        components: {
            Picks: require('../vue/Picks.vue'),
            Roster: require('../vue/Roster.vue'),
        },
    }
</script>

<style scoped>
</style>
