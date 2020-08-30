<template>
    <div class="root-content-sizer">
        <template v-if="typeof userInfo === 'undefined'">
            Loading...
        </template>
        <template v-else>
            <div class="root-content-panel-wrap info">
                <div class="username">{{ userInfo.user.name }}</div>
                <transition name="fade">
                    <form v-show="changingUsername" @submit="onUsernameChangeFormSubmit">
                        <input type='text' v-model="userInfo.user.name"/>
                    </form>
                </transition>
                <OverwatchButton
                        v-if="isThisMe && !changingUsername"
                        type="default"
                        v-hammer:tap="() => {changingUsername = !changingUsername}"
                >change username
                </OverwatchButton>
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
import Cookies from 'js-cookie';
import Guide from "@/vue/guides/Guide";
import UserInfoVso from "@/js/vso/UserInfoVso";

const backend = new Backend(axios);
export default {
    props: {},
    computed: {
        isThisMe() {
            const cookie = Cookies.get('userId');
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
        onUsernameChangeFormSubmit(e) {
            e.preventDefault();
            this.changingUsername = false;
            console.log(this.userInfo);
            backend.changeUsername(this.userInfo.user.name)
            .then(result => {
                Cookies.set('username', this.userInfo.user.name);
            })
            return false
        },
    },
    async mounted() {
        this.userInfo = new UserInfoVso(await (backend.getUserInfo(this.userId)));
    },
    components: {
        Guide,
        OverwatchButton,
        TrainingGoal,
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

.username {
    font-family: 'BigNoodleTooOblique', 'sans-serif';
    font-size: 8em;
    text-shadow: 0 0 .1em #333;
    color: white;
    position: absolute;
    top: -3rem;
    z-index: 1;
    opacity: .5;
    user-select: none;
    white-space: nowrap;
}

.info {
    text-align: right;

    button {
        font-size: 1.9em;
        vertical-align: middle;
    }

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
</style>
