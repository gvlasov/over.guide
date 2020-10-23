<template>
    <div
            class="notifications-section"
            v-click-outside="() => show = false"
    >
        <div
                class="bell-button"
                v-hammer:tap="() => show = !show"
        >
            <div class="bell-button-content-wrap">
                <font-awesome-icon icon="bell"/>
                <div
                        v-if="totalUnread > 0"
                        class="counter"
                >{{ totalUnread }}
                </div>
            </div>
        </div>
        <transition name="notifications" appear>
            <div
                    v-if="show"
                    class="notifications-wrap root-content-sizer"
            >
                <div
                        class="root-content-panel-wrap"
                >
                    <div class="notifications">
                        <div
                                v-if="notifications === null"
                                class="status-message"
                        >
                            Loading notifications
                        </div>
                        <template v-else>
                            <Notification
                                    v-for="notification in notifications"
                                    :key="notification.id"
                                    :notification="notification"
                                    @navigatedToComment="() => show = false"
                            />
                        </template>
                        <InfiniteLoading
                                ref="infiniteLoading"
                                direction="bottom"
                                @infinite="infiniteHandler"
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
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import NotificationReadDto from "data/dto/NotificationReadDto";
import Backend from "@/ts/Backend";
import {Watch} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import Notification from "@/vue/notifications/Notification.vue";
import {InfiniteHandlerState} from "@/ts/InfiniteHandlerState";
import InfiniteLoading from "vue-infinite-loading";
import WeakPanel from "@/vue/guides/WeakPanel.vue";

const AnchorRouterLink = require('vue-anchor-router-link').default;

const ClickOutside = require('vue-click-outside')

@Component({
    components: {
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

    show: boolean = false

    notifications: NotificationReadDto[] | null = null

    alreadyLoadedIds: number[] = []

    hasNextPage: boolean | null = true

    totalUnread: number = 0

    notificationCheckIntervalMs = 30 * 1000

    async infiniteHandler($state: InfiniteHandlerState) {
        await Backend.instance.getFeedNotifications(
            this.alreadyLoadedIds
        )
            .then(page => {
                if (this.notifications === null) {
                    this.notifications = []
                }
                this.totalUnread = page.totalUnread
                this.notifications.push(...page.notifications);
                this.alreadyLoadedIds.push(...page.notifications.map(dto => dto.id as number))
                if (this.notifications.length > 0) {
                    $state.loaded()
                }
                if (!page.hasNextPage) {
                    $state.complete()
                }
                this.hasNextPage = page.hasNextPage
            })
    }

    @Watch('show')
    onShowChange(newValue) {
        if (newValue) {
            Backend.instance.markNotificationsRead(
                this.notifications.map(n => n.id)
            )
            this.$emit('open')
        } else {
            for (let notification of this.notifications) {
                notification.read = true
            }
            this.$emit('close')
        }
    }

    @Watch('$route')
    onRouteChange() {
        this.show = false
    }

    get unreadNotificationsCount(): number {
        if (this.notifications === null) {
            return 0
        }
        return this.notifications.filter(n => !n.read).length
    }

    mounted() {
        this.infiniteHandler(
            {
                complete: () => void 0,
                error: () => void 0,
                loaded: () => void 0,
                reset: () => void 0,
            }
        )
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
                this.resetInfiniteLoading()
                this.infiniteHandler(
                    {
                        complete: () => void 0,
                        error: () => void 0,
                        loaded: () => void 0,
                        reset: () => void 0,
                    }
                )
            }
        }, this.notificationCheckIntervalMs)
    }

    resetInfiniteLoading() {
        if (this.$refs.infiniteLoading) {
            (this.$refs.infiniteLoading as any).stateChanger.reset();
        }
        this.alreadyLoadedIds.splice(0, this.alreadyLoadedIds.length)
        this.notifications.splice(0, this.notifications.length)
        this.hasNextPage = null;
    }

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';

.notifications-section {
    cursor: pointer;
    text-align: center;
    max-height: 10em;

    .bell-button {
        font-size: 1em;
        user-select: none;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .bell-button-content-wrap {
            position: relative;

            .counter {
                background-color: hsl(16, 80%, 50%);
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 50%;
                width: 1em;
                height: 1em;
                line-height: .9em;
                padding: .2em;
                font-size: .5em;
            }
        }

    }

    .notifications-wrap {
        position: absolute;
        top: 100%;
        left: 0;

        .notifications {
            letter-spacing: initial;
            cursor: initial;
            color: black;
            white-space: normal;
            box-shadow: 0 .9em .8em hsla(0, 0%, 20%, .5);
            border-radius: 0 0 .2em .2em;
            text-align: left;
            font-size: 1rem;
            max-height: 80vh;
            overflow-y: scroll;
            overscroll-behavior: none contain;

            & ::v-deep .infinite-loading-container {
                height: 2em;
            }

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

        .notifications-enter {
            opacity: 0;
            top: 1em;
        }

        .notifications-enter-to {
            opacity: 1;
            top: 0;
        }

        .notifications-enter-active {
            transition: opacity 1s;
        }
    }

}
</style>