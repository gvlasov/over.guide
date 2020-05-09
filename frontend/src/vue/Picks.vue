<template>
    <div>
        <ul class="picks-list">
            <HeroPortrait
                    v-for="hero in heroes"
                    :hero="hero"
                    :show-name="showName"
                    class="portrait"
                    style="width: 5vw;"
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
        methods: {},
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

    .picks-list {
        list-style: none;
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
    }
</style>
