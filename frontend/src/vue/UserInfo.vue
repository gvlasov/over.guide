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
                        <OverwatchButton
                                v-if="isThisMe"
                                type="default"
                                v-hammer:tap="logout"
                        >Logout
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
            <div class="guide-feed">
                <div

                        v-for="guide in userInfo.lastAuthoredGuides"
                        :key="guide.guideId"
                        class="root-content-panel-wrap"
                >
                    <Guide
                            :guide="guide"
                            :show-training-goal-button="true"
                            :search-descriptor="null"
                    />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import TrainingGoal from "@/vue/guides/TrainingGoal";
import OverwatchButton from "@/vue/OverwatchButton";
import axios from 'axios';
import Backend from "@/js/Backend";
import Guide from "@/vue/guides/Guide";
import UserInfoVso from "@/js/vso/UserInfoVso";
import UsernameInput from "@/vue/UsernameInput";
import Authentication from "@/js/Authentication";
import BackgroundHeading from "@/vue/BackgroundHeading";

const backend = new Backend(axios);
const auth = new Authentication()
export default {
    props: {},
    computed: {
        isThisMe() {
            const cookie = auth.userId;
            if (typeof cookie === 'undefined') {
                return false;
            }
            return Number.parseInt(cookie) === this.userInfo.user.id;
        },
    },
    data() {
        return {
            userId: this.$route.params.id,
            changingUsername: false,
            userInfo: undefined,
        };
    },
    methods: {
        logout() {
            auth.logout();
        },
    },
    async mounted() {
        backend.getUserInfo(this.userId)
            .then(dto => {
                this.userInfo = new UserInfoVso(dto);
            })
            .catch(e => {
                if (e.response.status === 404) {
                    this.userInfo = null;
                }
            })
    },
    components: {
        BackgroundHeading,
        Guide,
        OverwatchButton,
        TrainingGoal,
        UsernameInput,
    },
};

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

.loading-notice {
    font-size: 8em;
    text-shadow: 0 0 .1em #333;
    color: white;
    font-family: BigNoodleTooOblique, sans-serif;
}

.username {
    position: absolute;
    top: -3rem;
    z-index: 1;
}

.info {
    text-align: right;

    .buttons-wrap {
        display: inline-flex;
        gap: .5em;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: flex-end;
        @include overwatch-futura;
        color: white;

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
