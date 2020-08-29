<template>
    <div class="navigation">
        <router-link
                to="/search"
                v-bind:class="{active: currentRouteStartsWith('/search')}"
        >Browse guides
        </router-link>
        <router-link
                to="/guide-editor"
                v-bind:class="{active: currentRouteStartsWith('/guide-editor')}"
        >Create guide
        </router-link>
        <router-link
                to="/training-goals"
                v-bind:class="{active: currentRouteStartsWith('/training-goals')}"
        >Training goals
        </router-link>
        <!--        <router-link to="/testing-ground">Testing ground</router-link>-->
        <BattlenetAuthButton
                class="auth-button"
        />
    </div>
</template>

<script>
import BattlenetAuthButton from "@/vue/BattlenetAuthButton";

export default {
    methods: {
        currentRouteStartsWith(path) {
            return this.$route.path.startsWith(path);
        }
    },
    components: {
        BattlenetAuthButton,
    },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/tags.scss";

.navigation {
    $underline-width: .3em;
    font-size: 1.7em;
    background-color: hsla(227, 29%, 45%, .7);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 2rem;

    a:not(.auth-button) {
        @include overwatch-futura;
        color: white;
        text-decoration: none;
        white-space: nowrap;

        &.active, &:hover {
            background-color: $overwatch-button-default-bg-color;
            border-bottom: $underline-width solid $tag-ally-color;
        }
    }

    .auth-button, a {
        flex-grow: 1;
        padding: .8rem 0 .8rem 0;
    }

    .auth-button {
        &:hover {
            background-color: hsla(227, 29%, 45%, 1);
        }
        border-bottom: $underline-width solid transparent;
    }
}
</style>
