<template>
    <div class="app">
        <ScrollToTop ref="scrollToTop"/>
        <Navigation/>
        <div class="router-content-wrap">
            <router-view @contentChange="resetScrollToTop"></router-view>
        </div>
    </div>
</template>

<script>
import Navigation from "@/vue/Navigation";
import ScrollToTop from "@/vue/ScrollToTop";

export default {
    methods: {
        resetScrollToTop() {
            this.$refs.scrollToTop.reset();
        },
    },
    data() {
        return {};
    },
    watch: {
        $route() {
            this.resetScrollToTop();
        },
    },
    components: {
        Navigation,
        ScrollToTop,
    },
}
</script>

<style lang="scss" scoped>
.app {
    text-align: center;
    width: min-content;
    margin: 0 auto;
    min-height: 100vh;
    overflow-x: hidden;

    & > * {
        position: relative;
        z-index: 2;
    }

    .scroll-to-top {
        position: fixed;
        z-index: 1;
    }
}

</style>
