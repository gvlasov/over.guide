<template>
    <div class="portrait">
        <HeroPortrait
                :hero="hero"
                :show-name="showName"
        />
    </div>
</template>

<script>
    import HeroPortrait from "@/vue/HeroPortrait.vue";

    export default {
        props: {
            hero: Object,
        },
        methods: {
            touch(e) {
                e.preventDefault()
            }
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
        display: inline-block;
        margin-right: 1vw;
        overflow: hidden;
        height: 9vw;
    }

    .portrait > * {
        width: 7vw;
        height: auto;
    }
</style>
