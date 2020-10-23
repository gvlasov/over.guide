<template>
    <div class="logout-danger-notice">
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
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import Vue from 'vue'
import Component from "vue-class-component";

@Component({
    components: {
        OverwatchButton,
    },
})
export default class LogoutDangerNotice extends Vue {
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.logout-danger-notice {
    padding: 2em;
    background-color: hsla(320, 30%, 20%, .92);
    @include overwatch-futura;

    .buttons {
        margin-top: 2em;
    }
}

</style>
