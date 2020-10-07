<template>
    <div class="app">
        <ScrollToTop ref="scrollToTop"/>
        <Navigation/>
        <BackgroundHeading
        >{{$route.name || ' '}}</BackgroundHeading>
        <div class="router-content-wrap">
            <router-view @contentChange="resetScrollToTop"></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import Navigation from "@/vue/Navigation";
import ScrollToTop from "@/vue/ScrollToTop";
import Vue from 'vue'
import {Ref, Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import BackgroundHeading from "./BackgroundHeading.vue";

@Component({
    components: {
        BackgroundHeading,
        Navigation,
        ScrollToTop,
    },
})
export default class App extends Vue {
    @Ref('scrollToTop') scrollToTop: any
    declare $router: any

    resetScrollToTop() {
        this.scrollToTop.reset();
    }

    @Watch('$route')
    onRouteChange() {
        this.resetScrollToTop();
    }

    mounted() {
        const path = localStorage.getItem('pathBeforeBnetAuth');
        if (path !== null) {
            localStorage.removeItem('pathBeforeBnetAuth')
            this.$router.replace(path)
        }
    }

}
</script>

<style lang="scss" scoped>
.app {
    text-align: center;
    width: min-content;
    margin: 0 auto;
    min-height: 100vh;

    & > * {
        position: relative;
        z-index: 2;
    }

    .scroll-to-top {
        position: fixed;
        z-index: 1;
    }
    .background-heading {
        @media screen and (min-width: 48em) {
            & {
                visibility: hidden;
            }
        }
    }
}

</style>
