<template>
    <div class="app root-content-sizer">
        <div class="navigation-bar">
            <Navigation class="root-content-sizer"/>
        </div>
        <ScrollToTop ref="scrollToTop"/>
        <div class="below-navigation root-content-sizer">
            <BackgroundHeading
            >{{ $route.name || ' ' }}
            </BackgroundHeading>
            <div
                    class="router-content-wrap"
            >
                <router-view @contentChange="resetScrollToTop"></router-view>
            </div>
        </div>
        <portal-target
                name="modal"
                class="modal-portal"
        >

        </portal-target>
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

    showPageContent: boolean = true

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
@import '~@/assets/css/common.scss';

.app {
    text-align: center;
    margin: 0 auto;
    min-height: 100vh;
    min-width: 100%;

    @media screen and (orientation: portrait) {
        padding-bottom: 4em;
    }

    .navigation-bar {
        display: flex;
        justify-content: center;
        position: sticky;
        top: 0;
        z-index: 3;
        background-color: hsl(228, 25%, 56%);
        width: 100%;
        @media screen and (hover: none) {
            position: fixed;
            bottom: 0;
            top: auto;
        }

        .navigation {
            width: 100%;
        }
    }

    .below-navigation {
        margin: 0 auto;
    }

    .scroll-to-top {
        z-index: 1;
    }

    .router-content-wrap {
        position: relative;
        z-index: 2;
    }

    .modal-portal {
        position: relative;
        z-index: 4;
    }

    .background-heading {
        @media screen and (min-width: 48em) {
            & {
                visibility: hidden;
            }
        }
        @media screen and (orientation: landscape) and (min-aspect-ratio: 21/9) and (min-width: 48em) and (max-height: 30em) {
            height: .3em;
        }
    }
}

</style>
