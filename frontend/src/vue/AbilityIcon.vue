<template>
    <img
            :src="imgSrc(ability)"
            v-bind:data-ability-data-name="ability.dataName"
    />
</template>

<script>
    import AbilityDto from "data/dto/AbilityDto";
    import heroes from 'data/heroes'

    export default {
        name: 'AbilityIcon',
        props: {
            'ability': {
                type: Object,
            },
        },
        methods: {
            /**
             * @param {AbilityDto} ability
             */
            imgSrc(ability) {
                return '/images/abilities/' + heroes.get(ability.heroId).dataName + '/' + ability.dataName + '.png';
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
