<template>
    <div
            class="notifications-section"
            v-click-outside="() => show = false"
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

                        <div
                                slot="no-results"
                                class="notifications-end"
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

const Debounce = require('debounce-decorator').default

const AnchorRouterLink = require('vue-anchor-router-link').default;

const ClickOutside = require('vue-click-outside')

@Component({
    components: {
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
    }
})
export default class NotificationsSection extends Vue {

    @Ref('infiniteLoading')
    infiniteLoading: InfiniteLoading

    feed: NotificationFeedVso = new NotificationFeedVso()

    auth = Authentication.instance

    show: boolean = false

    notificationCheckIntervalMs = 30 * 1000

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

    @Debounce(10 * 1000)
    checkNotificationsSometimes() {
        this.feed.loadNextPage(this.infiniteLoading.stateChanger)
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

    mounted() {
        this.feed.loadNextPage(this.infiniteLoading.stateChanger)
        window.addEventListener(
            'keyup',
            (e) => {
                if (e.code === 'Escape') {
                    this.show = false
                }
            }
        )
        setInterval(() => {
            if (!this.show) {
                this.feed.reset(this.infiniteLoading.stateChanger)
            }
        }, this.notificationCheckIntervalMs)
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
            text-align: left;
            font-size: 1rem;
            overflow-y: scroll;
            overscroll-behavior: none contain;
            max-height: 100%;
            height: 100%;

            @include custom-desktop-scrollbar(hsla(227, 16%, 48%, 0.98));

            .notifications-end {
                background-color: hsla(110, 47%, 48%, 0.98);
                color: white;
                padding: .7em;
                font-size: 1.5em;
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
