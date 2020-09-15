<template>
    <div class="root-content-panel-wrap">
    <div class="navigation">
        <router-link
                to="/search"
                v-bind:class="{active: currentRouteStartsWith('/search')}"
        ><div>Browse guides</div>
        </router-link>
        <router-link
                to="/guide-editor/new"
                v-bind:class="{active: currentRouteStartsWith('/guide-editor')}"
        ><div>Create guide</div>
        </router-link>
        <router-link
                to="/training-goals"
                v-bind:class="{active: currentRouteStartsWith('/training-goals')}"
        ><div>Training goals</div>
        </router-link>
        <!--        <router-link to="/testing-ground">Testing ground</router-link>-->
        <BattlenetAuthButton v-if="typeof username === 'undefined'" />
        <a
                v-else
                v-bind:href="`/#/user/${userId}`"
                v-bind:class="{active: typeof userId !== 'undefined' && currentRouteStartsWith(`/user/${userId}`)}"
        ><div>{{username}}</div></a>
    </div>
    </div>
</template>

<script>
import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
import Authentication from "@/js/Authentication";

const auth = new Authentication()
export default {
    methods: {
        currentRouteStartsWith(path) {
            return this.$route.path.startsWith(path);
        }
    },
    data() {
        return {
            username: auth.username,
            userId: auth.userId,
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
@import "~@/assets/css/common.scss";

.navigation {
    $underline-width: .3em;
    font-size: 1.7em;
    background-color: hsla(227, 29%, 45%, .7);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 2rem;

    a:not(.battle-net-button) {
        @include overwatch-futura;
        text-decoration: none;
        white-space: nowrap;
        border-bottom: $underline-width solid transparent;

        &.active, &:hover {
            background-color: $overwatch-button-default-bg-color;
            border-bottom: $underline-width solid $tag-teammate-color;
        }
    }

    a {
        div {
            flex-grow: 0;
        }
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        align-self: center;
        height: 4rem;
        box-sizing: border-box;
    }

    .battle-net-button {
        &:hover {
            background-color: hsla(227, 29%, 45%, 1);
        }
        border-bottom: $underline-width solid transparent;
    }
}
</style>
