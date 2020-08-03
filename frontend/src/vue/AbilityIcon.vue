<template>
    <img
            :src="imgSrc"
            v-bind:data-ability-data-name="ability.dataName"
    />
</template>

<script>
    import AbilityVso from "@/js/vso/AbilityVso";

    export default {
        name: 'AbilityIcon',
        props: {
            ability: {
                type: AbilityVso,
                required: true,
            },
        },
        computed: {
            imgSrc() {
                return '/images/abilities/' + this.ability.hero.dataName + '/' + this.ability.dataName + '.png';
            },
        },
        data() {
            return {}
        },
    };

</script>

<style scoped>
    img {
        width: 100%;
    }
</style>
