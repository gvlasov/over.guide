<template>
    <div>
        <h1>Overwatch Counters</h1>
        <picks></picks>
    </div>
</template>

<script>
    module.exports = {
        components: {
            picks: require('../vue/Picks.vue')
        },
    }
</script>

<style scoped>
    h1 {
        color: red
    }
</style>
