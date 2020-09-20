<template>
    <LoginNotice>
        <div>This will log you out from
            <strong>every</strong> site that uses this Battle.net account
        </div>
        <div class="buttons">
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => $emit('back')"
            >Cancel
            </OverwatchButton>
            <OverwatchButton
                    type="main"
                    v-hammer:tap="() => $emit('confirm')"
            >Log me out
            </OverwatchButton>
        </div>
    </LoginNotice>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import LoginNotice from "@/vue/LoginNotice";
import Vue from 'vue'
import Component from "vue-class-component";

@Component({
    components: {
        LoginNotice,
        OverwatchButton,
    },
})
export default class LogoutDangerNotice extends Vue {
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.buttons {
    margin-top: 2em;
}

</style>
