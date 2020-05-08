<template>
    <div>
        <ul>
            <HeroPortrait
                    v-for="hero in heroes"
                    :hero="hero"
                    :show-name="showName"
                    class="portrait"
            />
        </ul>
    </div>
</template>

<script>
    import HeroPortrait from "./HeroPortrait.vue";

    export default {
        props: {
            heroes: {
                type: Array,
                default() {
                    return [null, null, null, null, null, null];
                }
            }
        },
        methods: {
        },
        data() {
            const self = this;
            return {
                showName: true,
            }
        },
        components: {
            HeroPortrait: HeroPortrait
        },
    };

</script>

<style scoped>
    .portrait {
        width: 5em;
    }
</style>
