<template>
    <div
            style="display: table-cell"
    >
        <HeroPortrait
                class="portrait"
                :hero="hero"
                :base-url="'/images/roster-portraits'"
        />
    </div>
</template>

<script>
    import HeroPortrait from "@/vue/HeroPortrait";

    export default {
        props: {
            hero: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {
            HeroPortrait,
        },
    };
</script>

<style scoped>
    .portrait {
        display: table-cell;
        height: 100%;
        width: auto;
        vertical-align: middle;
        background-color: #28253a;
        border-radius: .4em;
    }
</style>
