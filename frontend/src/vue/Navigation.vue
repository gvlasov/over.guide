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
                v-bind:class="{
            active: currentRouteStartsWith('/training-goals'),
            'add-blink': trainingGoalAddBlinkOn,
            'remove-blink': trainingGoalRemoveBlinkOn,
        }"
        >
            <font-awesome-icon icon="bookmark"/>
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
import {EventBus} from '@/ts/EventBus'

const Debounce = require('debounce-decorator').default

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

    trainingGoalAddBlinkOn: boolean = false
    trainingGoalRemoveBlinkOn: boolean = false

    currentRouteStartsWith(path) {
        return this.$route.path.startsWith(path);
    }

    onAddTrainingGoal() {
        console.log('add training goal')
        this.trainingGoalAddBlinkOn = true
        this.debounceAddUnblink()
    }

    onRemoveTrainingGoal() {
        console.log('remove training goal')
        this.trainingGoalRemoveBlinkOn = true
        this.debounceRemoveUnblink()
    }

    @Debounce(300)
    debounceAddUnblink() {
        this.trainingGoalAddBlinkOn = false
    }

    @Debounce(300)
    debounceRemoveUnblink() {
        this.trainingGoalRemoveBlinkOn = false
    }

    mounted() {
        EventBus.instance.$on('removeTrainingGoal', this.onRemoveTrainingGoal)
        EventBus.instance.$on('addTrainingGoal', this.onAddTrainingGoal)
    }

    destroyed() {
        EventBus.instance.$off('removeTrainingGoal', this.onRemoveTrainingGoal)
        EventBus.instance.$off('addTrainingGoal', this.onAddTrainingGoal)
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
        transition: background-color .2s, transform .2s, box-shadow .2s;

        background-color: hsl(228, 25%, 56%);

        &.active, &:hover {
            background-color: $overwatch-button-default-bg-color;
            border-bottom: $underline-width solid $tag-teammate-color;
        }

        &.add-blink {
            transition: background-color .2s, transform .2s, box-shadow .2s;
            background-color: $overwatch-button-main-bg-color;
            box-shadow: 0 0 .9em $overwatch-button-main-bg-color;
        }

        &.remove-blink {
            transition: background-color .2s, transform .2s, box-shadow .2s;
            background-color: $overwatch-button-default-bg-color;
            box-shadow: 0 0 .9em $overwatch-button-default-bg-color;
        }

        div, svg {
            flex-grow: 0;
        }

        svg {
            display: block;
            margin: 0 auto;
        }

        @media screen and (max-width: 54em) {
            div {
                display: none;
            }
        }
        @media screen and (min-width: 54em) {
            svg {
                display: none;
            }
        }

    }

    .notifications-section {
        & ::v-deep .notifications-wrap {
            top: 0;
            padding-top: $height;
            @media screen and (hover: none) {
                padding-top: $height;
                padding-bottom: 0;
                bottom: 0;
                transform: translateY(-100%);
            }
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
