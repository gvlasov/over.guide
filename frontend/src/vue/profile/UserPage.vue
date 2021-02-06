<template>
    <div class="user-page root-content-sizer">
        <div
                v-if="$asyncComputed.userInfo.updating"
                class="loading-notice"
        >
            Loading
        </div>
        <div
                v-else-if="isDeletedUserOpeningHimself"
                class="loading-notice"
        >
            <div>
                <div class="deletion-notice">Your user was deleted</div>
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => Auth.logoutSite()"
                >Log out
                </OverwatchButton>
            </div>
        </div>
        <div
                v-else-if="userInfo === null"
                class="loading-notice"
        >
            User doesn't exist
        </div>
        <UserInfo
                v-else
                :user-info="userInfo"
        />
    </div>
</template>

<script lang="ts">
import Backend from "@/ts/Backend";
import UserInfoVso from "@/ts/vso/UserInfoVso";
import Vue from 'vue'
import Component from "vue-class-component";
import AsyncComputedProp from 'vue-async-computed-decorator'
import UserInfo from "./UserInfo.vue";
import Authentication from "@/ts/Authentication";
import OverwatchButton from "@/vue/OverwatchButton.vue";

@Component({
    components: {
        UserInfo,
        OverwatchButton,
    },
})
export default class UserPage extends Vue {
    declare $route: any

    Auth = Authentication.instance

    declare userInfo: UserInfoVso | null

    @AsyncComputedProp()
    userInfo() {
        return Backend.instance.getUserInfo(this.$route.params.id)
            .then(dto => new UserInfoVso(dto))
            .catch(e => {
                if (e.response.status === 404) {
                    return new Promise((resolve, reject) => resolve(null))
                }
            })
    }

    get isDeletedUserOpeningHimself() : boolean {
        console.log(this.$route.params.id)
        return this.userInfo === null && Authentication.instance.loggedIn && Authentication.instance.userId === Number.parseInt(this.$route.params.id)
    }
}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';

.loading-notice {
    font-size: 8em;
    text-shadow: 0 0 .1em #333;
    color: white;
    font-family: BigNoodleTooOblique, sans-serif;
    .deletion-notice {
        font-size: .6em;
    }
}
</style>
