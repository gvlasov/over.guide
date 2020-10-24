<template>
    <div class="user-page root-content-sizer">
        <div
                v-if="$asyncComputed.userInfo.updating"
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
        <UserInfo
                v-else
                :user-info="userInfo"
        />
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import Backend from "@/ts/Backend";
import UserInfoVso from "@/ts/vso/UserInfoVso";
import Authentication from "@/ts/Authentication";
import Vue from 'vue'
import Component from "vue-class-component";
import AsyncComputedProp from 'vue-async-computed-decorator'
import UserInfo from "./UserInfo.vue";

const backend = new Backend(axios);
const auth = new Authentication()
@Component({
    components: {
        UserInfo,
    },
})
export default class UserPage extends Vue {
    declare $route: any

    declare userInfo: UserInfoVso | null

    @AsyncComputedProp()
    userInfo() {
        return backend.getUserInfo(this.$route.params.id)
            .then(dto => {
                return new UserInfoVso(dto);
            })
            .catch(e => {
                if (e.response.status === 404) {
                    return null
                }
                throw e
            })
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
}
</style>
