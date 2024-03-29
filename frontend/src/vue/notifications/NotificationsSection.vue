<template>
    <div
            class="notifications-section"
            v-click-outside="onTapOutside"
    >
        <NotificationsButton
                :notifications="feed.items"
                v-hammer:tap="() => show = !show"
        />
        <transition name="notifications" appear>
            <div
                    v-show="show"
                    class="notifications-wrap root-content-sizer"
            >
                <div
                        v-if="auth.authenticated"
                        class="notifications"
                        v-bind:class="feed.items.length === 0 ? 'empty' : ''"
                >
                    <div
                            v-if="feed.items === null"
                            class="status-message"
                    >
                        Loading notifications
                    </div>
                    <template v-else>
                        <Notification
                                v-for="notification in feed.items"
                                :key="notification.id"
                                :notification="notification"
                                @navigatedToComment="() => show = false"
                        />
                    </template>
                    <InfiniteLoading
                            ref="infiniteLoading"
                            direction="bottom"
                            @infinite="(status) => feed.loadNextPage(status)"
                    >
                        <SpinnerBlock slot="spinner"/>
                        <div
                                slot="no-results"
                                class="no-notifications"
                        >
                            No notifications
                        </div>
                        <div
                                slot="no-more"
                                class="notifications-end"
                        >
                            No more notifications
                        </div>
                    </InfiniteLoading>
                </div>
                <div

                        v-else
                        class="login-requirement"
                >
                    Log in to receive notifications
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import Backend from "@/ts/Backend";
import {Ref, Watch} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import Notification from "@/vue/notifications/Notification.vue";
import InfiniteLoading from "vue-infinite-loading";
import WeakPanel from "@/vue/guides/WeakPanel.vue";
import Authentication from "@/ts/Authentication";
import NotificationsButton from "@/vue/notifications/NotificationsButton.vue";
import NotificationFeedVso from "@/ts/vso/NotificationFeedVso";
import SpinnerBlock from "../SpinnerBlock.vue";
import io from "socket.io-client";
import NotificationReadDto
    from "../../../../backend/src/data/dto/NotificationReadDto";

const Debounce = require('debounce-decorator').default

const AnchorRouterLink = require('vue-anchor-router-link').default;
const ClickOutside = require('vue-click-outside')

@Component({
    components: {
        SpinnerBlock,
        NotificationsButton,
        Notification,
        UserLink,
        RelativeTime,
        InfiniteLoading,
        AnchorRouterLink,
        WeakPanel,
    },
    directives: {
        ClickOutside,
    },
})
export default class NotificationsSection extends Vue {

    @Ref('infiniteLoading')
    infiniteLoading: InfiniteLoading

    auth = Authentication.instance

    feed: NotificationFeedVso = new NotificationFeedVso(this.auth)

    show: boolean = false

    static notificationCheckIntervalMs = 10 * 1000;

    @Watch('show')
    onShowChange(newValue) {
        if (newValue) {
            this.markNotificationsReadIfAvailable()
            this.$emit('open')
        } else {
            if (this.auth.authenticated) {
                for (let notification of this.feed.items) {
                    notification.read = true
                }
            }
            this.$emit('close')
        }
    }

    markNotificationsReadIfAvailable() {
        if (this.auth.authenticated) {
            Backend.instance.markNotificationsRead(
                this.feed.items.map(n => n.id)
            )
        }
    }

    @Watch('$route')
    onRouteChange() {
        this.show = false
    }

    onTapOutside() {
        if (this.show) {
            this.show = false
        }
    }

    mounted() {
        if (this.auth.authenticated) {
            const socket = io(process.env.BACKEND_BASE_URL);
            socket.on('connect', () => {
                socket.emit('auth', this.auth.authToken, (data: NotificationReadDto[]) => {
                    this.feed = new NotificationFeedVso(socket)
                    this.feed.loadNextPage(this.infiniteLoading.stateChanger)
                })
            })
            socket.on('new', (notification: NotificationReadDto) => {
                this.feed.prependItems([notification])
            })
        }
        window.addEventListener(
            'keyup',
            (e) => {
                if (e.code === 'Escape') {
                    this.show = false
                }
            }
        )
    }

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';

.notifications-section {
    cursor: pointer;
    text-align: center;
    max-height: 10em;

    .notifications-wrap {
        box-sizing: border-box;
        position: absolute;
        left: 0;
        max-height: 100vh;
        height: 100vh;
        z-index: -1;

        .notifications {
            letter-spacing: initial;
            cursor: initial;
            color: black;
            white-space: normal;
            box-shadow: 0 .9em .8em hsla(0, 0%, 20%, .5);
            border-radius: 0 0 .2em .2em;
            @media screen and (orientation: portrait) {
                border-radius: 0;
            }
            text-align: left;
            font-size: 1rem;
            overflow-y: scroll;
            overscroll-behavior: none contain;
            max-height: 100%;

            @media screen and (hover: hover) {
                &::-webkit-scrollbar {
                    display: none;
                }
            }

            .notifications-end {
                background-color: hsla(110, 47%, 48%, 0.98);
                color: white;
                padding: .7em;
                font-size: 1.5em;
            }

            .no-notifications {
                background-color: hsl(228, 25%, 56%);
                color: white;
                padding: .7em;
                font-size: 1.5em;
                height: 6em;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .status-message {
                text-align: center;
                padding: .7em;
                font-size: 1.5em;
                color: white;
            }
        }

        .login-requirement {
            background-color: hsla(227, 16%, 48%, 0.98);
            padding: 1em;
            box-shadow: 0 .9em .8em hsla(0, 0%, 20%, .5);
        }

        &.notifications-enter {
            opacity: 0;
        }

        &.notifications-enter-to {
            opacity: 1;
        }

        &.notifications-enter-active {
            transition: opacity .13s;
        }
    }

}
</style>
