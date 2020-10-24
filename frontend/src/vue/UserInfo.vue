<template>
    <div class="user-info">
        <div class="info">
            <BackgroundHeading class="username">{{ userInfo.user.name }}</BackgroundHeading>
            <template v-if="isThisMe">
                <div class="buttons-wrap">
                    <NotificationModalPopup
                            v-if="promptLogoutDanger"
                            @close="() => promptLogoutDanger = false"
                    >
                        <LogoutDangerNotice
                                @back="() => promptLogoutDanger = false"
                                @confirm="logout"
                        />
                    </NotificationModalPopup>
                    <OverwatchButton
                            v-if="isThisMe"
                            type="default"
                            v-hammer:tap="() => promptLogoutDanger = true"
                    >Log out
                    </OverwatchButton>
                    <UsernameInput
                            v-show="changingUsername"
                            v-model="userInfo.user.name"
                    />
                    <OverwatchButton
                            v-if="!changingUsername"
                            type="default"
                            v-hammer:tap="() => {changingUsername = !changingUsername}"
                    >change username
                    </OverwatchButton>
                </div>
            </template>
        </div>
        <OverwatchPanel class="stats">
            <div class="guide-votes-received-count">
                Total guide score: {{ userInfo.guideVotesReceivedCount }}
            </div>
        </OverwatchPanel>
        <OverwatchPanel
                v-if="userInfo.restrictions !== void 0"
                class="restrictions"
        >
            <div
                    v-for="restriction in userInfo.restrictions"
                    class="restriction"
            >
                <font-awesome-icon icon="ban"/>
                <div class="content">
                    <div class="label">
                        {{ restrictionTypes.get(restriction.id).defenderLabel }}
                    </div>
                    <div class="duration">
                        for {{ restrictionDuration(restriction) }}
                    </div>
                </div>
            </div>
        </OverwatchPanel>
        <div class="guide-feed">
            <Guide
                    v-for="head in userInfo.lastAuthoredGuidesFeed.guides"
                    :key="head.guideId"
                    :head="head"
                    :show-training-goal-button="true"
                    :search-descriptor="null"
                    @guideDeactivated="userInfo.lastAuthoredGuidesFeed.removeElementById"
            />
            <InfiniteLoading
                    v-if="userInfo !== null"
                    ref="infiniteLoading"
                    direction="bottom"
                    @infinite="infiniteHandler"
                    force-use-infinite-wrapper
            >

                <WeakPanel slot="no-results">
                    No authored guides
                </WeakPanel>
                <WeakPanel slot="no-more">
                    No more guides
                </WeakPanel>
            </InfiniteLoading>
        </div>
    </div>
</template>

<script lang="ts">
import TrainingGoal from "@/vue/guides/TrainingGoal";
import OverwatchButton from "@/vue/OverwatchButton";
import axios from 'axios';
import Backend from "@/ts/Backend";
import Guide from "@/vue/guides/Guide";
import UserInfoVso from "@/ts/vso/UserInfoVso";
import UsernameInput from "@/vue/UsernameInput";
import Authentication from "@/ts/Authentication";
import BackgroundHeading from "@/vue/BackgroundHeading";
import LogoutDangerNotice from "@/vue/LogoutDangerNotice";
import Vue from 'vue'
import Component from "vue-class-component";
import {InfiniteHandlerState} from "@/ts/InfiniteHandlerState";
import WeakPanel from "@/vue/guides/WeakPanel.vue";
import InfiniteLoading from "vue-infinite-loading";
import restrictionTypes from 'data/restrictionTypes'
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import {formatDistance} from "date-fns";
import RestrictionReadDto from "data/dto/RestrictionReadDto";
import ModalPopup from "@/vue/general/ModalPopup.vue";
import OverwatchPanel from '@/vue/general/OverwatchPanel'
import NotificationModalPopup from "@/vue/general/NotificationModalPopup.vue";
import {Prop} from "vue-property-decorator";

const backend = new Backend(axios);
const auth = new Authentication()
@Component({
    components: {
        NotificationModalPopup,
        ModalPopup,
        RelativeTime,
        LogoutDangerNotice,
        BackgroundHeading,
        Guide,
        OverwatchButton,
        TrainingGoal,
        UsernameInput,
        WeakPanel,
        InfiniteLoading,
        OverwatchPanel,
    },
})
export default class UserInfo extends Vue {
    restrictionTypes = restrictionTypes

    @Prop({required: true})
    userInfo: UserInfoVso

    promptLogoutDanger: boolean = false
    changingUsername: boolean = false
    alreadyLoadedGuideIds: number[] = []
    hasNextPage: boolean = true

    async infiniteHandler(state: InfiniteHandlerState) {
        await Backend.instance.searchGuidesByAuthorPaginated(
            {
                clientAlreadyHasGuideIds: this.alreadyLoadedGuideIds,
                authorId: this.userInfo.user.id,
            }
        )
            .then(page => {
                this.userInfo.lastAuthoredGuidesFeed.loadPage(page, state)
            })
    }

    get isThisMe(): boolean {
        const cookie = auth.userId;
        if (cookie === void 0) {
            return false;
        }
        return cookie === this.userInfo.user.id;
    }

    restrictionDuration(restriction: RestrictionReadDto): string {
        return formatDistance(
            new Date(restriction.end),
            new Date(),
        )
    }

    logout() {
        const img = document.createElement('img');
        img.src = auth.battleNetLogoutUrl;
        img.style.display = 'none';
        img.onerror = () => {
            auth.logoutSite()
        }
        this.$el.append(img)
    }

}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';

.user-info {
    .info {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .username {
            padding-left: .5em;
            z-index: 1;
            font-size: 5em;
            opacity: 1;
            text-shadow: 0 0 .05em hsla(0, 0%, 10%, .7);
        }

        .buttons-wrap {
            justify-content: right;
            display: inline-flex;
            gap: .5em;
            flex-direction: column;
            flex-wrap: nowrap;
            flex-grow: 1;
            align-items: flex-end;
            @include overwatch-futura;

            button {
                font-size: 1.9em;
                vertical-align: middle;

                form {
                    display: inline-block;
                    z-index: 2;
                    position: relative;

                    input[type=text] {
                        display: flex;
                        font-size: .8em;
                        vertical-align: middle;
                        flex-wrap: wrap;
                        justify-content: center;
                        box-sizing: border-box;
                        padding: .5rem .5rem .5rem .5rem;
                        background: #fff;
                        color: #495057;
                        outline: 0;
                        border-radius: .25em;
                        border-width: 0;
                        box-shadow: 0 .1em .3em rgba($overwatch-panel-bg-color, .4);
                        font-family: $body-font;
                    }
                }
            }
        }
    }

    .restrictions {
        margin-top: 1em;
        padding: 1em;
        background-color: hsla(10, 100%, 7%, .43);
        display: flex;
        gap: 1em;
        text-align: left;
        justify-content: center;

        .restriction {
            padding: .6em;
            background-color: hsl(0, 100%, 50%, .4);
            border-radius: .3em;
            box-shadow: 0 0 .1em black;
            display: flex;
            align-items: center;
            gap: .6em;

            svg {
                color: white;
                font-size: 2em;
            }

            .content {
                .label {
                    font-weight: bold;
                }

                .duration {
                    color: hsl(50, 90%, 70%);
                }
            }
        }
    }

    .stats {
        padding: 1em;
    }

    .guide-feed {
        display: flex;
        justify-content: start;
        flex-direction: column;
        gap: 2rem;
        margin-top: 2rem;
        margin-bottom: 3rem;
        position: relative;
        z-index: 2;

        .guide {
            max-width: 100vw;
            min-width: 100%;
        }
    }

}
</style>
