<template>
    <div class="root-content-sizer">
        <div
                v-if="typeof userInfo === 'undefined'"
                class="loading-notice"
        >
            Loading
        </div>
        <div
                v-else-if="userInfo === null"
                class="loading-notice"
        >
            User doesn't exist
        </div>
        <template v-else>
            <div class="root-content-panel-wrap info">
                <BackgroundHeading class="username">{{ userInfo.user.name }}</BackgroundHeading>
                <template v-if="isThisMe">
                    <div class="buttons-wrap">
                        <ModalPopup
                                v-if="promptLogoutDanger"
                        >
                            <LogoutDangerNotice
                                    @back="() => promptLogoutDanger = false"
                                    @confirm="logout"
                            />
                        </ModalPopup>
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
            <div class="root-content-panel-wrap">
                <div class="stats">
                    <div class="guide-votes-received-count">
                        Total guide score: {{ userInfo.guideVotesReceivedCount }}
                    </div>
                </div>
            </div>
            <div
                    v-if="userInfo.restrictions !== void 0"
                    class="root-content-panel-wrap"
            >
                <div class="restrictions">
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
                </div>
            </div>
            <div class="guide-feed">
                <div

                        v-for="head in userInfo.lastAuthoredGuides"
                        :key="head.guideId"
                        class="root-content-panel-wrap"
                >
                    <Guide
                            :head="head"
                            :show-training-goal-button="true"
                            :search-descriptor="null"
                            @guideDeactivated="onDeactivated"
                    />
                </div>
                <div class="root-content-panel-wrap">
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
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import WeakPanel from "@/vue/guides/WeakPanel.vue";
import InfiniteLoading from "vue-infinite-loading";
import restrictionTypes from 'data/restrictionTypes'
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import {formatDistance} from "date-fns";
import RestrictionReadDto from "data/dto/RestrictionReadDto";
import ModalPopup from "@/vue/general/ModalPopup.vue";

const backend = new Backend(axios);
const auth = new Authentication()
@Component({
    components: {
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
    },
})
export default class UserInfo extends Vue {
    restrictionTypes = restrictionTypes

    declare $route: any

    userId: number = this.$route.params.id
    changingUsername: boolean = false
    userInfo: UserInfoVso | null = null
    promptLogoutDanger: boolean = false
    alreadyLoadedGuideIds: number[] = []
    hasNextPage: boolean = true

    async infiniteHandler($state: InfiniteHandlerState) {
        await Backend.instance.searchGuidesByAuthorPaginated(
            {
                clientAlreadyHasGuideIds: this.alreadyLoadedGuideIds,
                authorId: this.userId,
            }
        )
            .then(page => {
                if (this.userInfo === null) {
                    throw new Error('UserInfo not loaded yet')
                }
                this.userInfo.lastAuthoredGuides.push(...page.guides.map(dto => new ExistingGuideHeadVso(dto)));
                this.alreadyLoadedGuideIds.push(...page.guides.map(dto => dto.guideHistoryEntry.guide.id as number))
                if (this.userInfo.lastAuthoredGuides.length > 0) {
                    $state.loaded()
                }
                if (!page.hasNextPage) {
                    $state.complete()
                }
                this.hasNextPage = page.hasNextPage
            })
    }

    get isThisMe(): boolean {
        const cookie = auth.userId;
        if (typeof cookie === 'undefined') {
            return false;
        }
        if (this.userInfo === null) {
            throw new Error('Null user info')
        }
        return cookie === this.userInfo.user.id;
    }

    get battleNetLogoutUrl(): string {
        return auth.battleNetLogoutUrl;
    }

    restrictionDuration(restriction: RestrictionReadDto): string {
        return formatDistance(
            new Date(restriction.end),
            new Date(),
        )
    }

    onDeactivated(guideId: number) {
        console.log('on deactivated')
        if (this.userInfo === null || this.userInfo.lastAuthoredGuides === void 0) {
            throw new Error()
        }
        const index: number | undefined = this.userInfo.lastAuthoredGuides.findIndex(
            g => guideId === g.entry.guideId
        );
        if (index === void 0) {
            throw new Error()
        } else {
            this.userInfo.lastAuthoredGuides.splice(
                index,
                1
            )
        }
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

    created() {
        backend.getUserInfo(this.userId)
            .then(dto => {
                this.userInfo = new UserInfoVso(dto);
                this.alreadyLoadedGuideIds = dto.lastAuthoredGuides.guides.map(g => g.guideHistoryEntry.guide.id)
                this.hasNextPage = dto.lastAuthoredGuides.hasNextPage
            })
            .catch(e => {
                if (e.response.status === 404) {
                    this.userInfo = null;
                }
            })
    }
}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';

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

.stats {
    @include overwatch-panel;
    padding: 1em;
}

.restrictions {
    margin-top: 1em;
    @include overwatch-panel;
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

.loading-notice {
    font-size: 8em;
    text-shadow: 0 0 .1em #333;
    color: white;
    font-family: BigNoodleTooOblique, sans-serif;
}


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
</style>
