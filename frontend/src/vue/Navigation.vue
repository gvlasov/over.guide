<template>
    <div class="navigation">
        <router-link
                to="/search"
                v-bind:class="{active: currentRouteStartsWith('/search')}"
        >
            <font-awesome-icon icon="home"/>
            <div>Browse guides</div>
        </router-link>
        <router-link
                to="/guide-editor/new"
                v-bind:class="{active: currentRouteStartsWith('/guide-editor')}"
        >
            <font-awesome-icon icon="plus-square"/>
            <div>Create guide</div>
        </router-link>
        <router-link
                to="/training-goals"
                v-bind:class="{active: currentRouteStartsWith('/training-goals')}"
        >
            <font-awesome-icon icon="brain"/>
            <div class="item-name">Training goals</div>
        </router-link>
        <BattlenetAuthButton v-if="username === null"/>
        <a
                v-else
                v-bind:href="`/#/user/${userId}`"
                v-bind:class="{active: userId !== null && currentRouteStartsWith(`/user/${userId}`)}"
        >
            <font-awesome-icon icon="user"/>
            <div>{{ username }}</div>
        </a>
        <NotificationsSection/>
    </div>
</template>

<script lang="ts">
import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
import Authentication from "@/ts/Authentication";
import Vue from 'vue'
import Component from "vue-class-component";
import NotificationsSection from "@/vue/notifications/NotificationsSection.vue";

@Component({
    components: {
        NotificationsSection,
        BattlenetAuthButton,
    },
})
export default class Navigation extends Vue {
    declare $route: any

    username: string = Authentication.instance.username || null
    userId: number = Authentication.instance.userId || null

    currentRouteStartsWith(path) {
        return this.$route.path.startsWith(path);
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/tags.scss";
@import "~@/assets/css/common.scss";

$height: 3.5rem;
.navigation {
    $underline-width: .3em;
    font-size: 1.7em;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-height: $height;
    overflow: visible;
    position: relative;

    a, .notifications-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-shrink: 1;
        flex-grow: 1;
        height: $height;
        box-sizing: border-box;
        @include overwatch-futura;
        text-decoration: none;
        white-space: nowrap;
        border-bottom: $underline-width solid transparent;
        min-width: 2.5em;

        &.active, &:hover {
            background-color: $overwatch-button-default-bg-color;
            border-bottom: $underline-width solid $tag-teammate-color;
        }

        div, svg {
            flex-grow: 0;
        }

        svg {
            display: block;
            margin: 0 auto;
        }

        @media screen and (max-width: 48em) {
            div {
                display: none;
            }
        }
        @media screen and (min-width: 48em) {
            svg {
                display: none;
            }
        }

    }

    .notifications-section {
        & ::v-deep .notifications-wrap {
            top: 0;
            padding-top: $height;
        }
    }


    .battle-net-button {
        &:hover {
            background-color: hsla(227, 29%, 45%, 1);
        }

        border-bottom: $underline-width solid transparent;
    }
}
</style>
