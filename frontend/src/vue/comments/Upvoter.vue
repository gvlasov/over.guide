<template>
    <div
            class="upvoter"
            v-bind:class="{upvoted: upvoted}"
    >
        <OverwatchButton
                type="default"
                v-hammer:tap="onTap"
                :disabled="!auth.loggedIn"
        >
            <font-awesome-icon icon="medal"/>
        </OverwatchButton>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import Backend from "@/ts/Backend";
import Authentication from "@/ts/Authentication";
import PostTypeId from "data/PostTypeId";

@Component({
    components: {OverwatchButton}
})
export default class Upvoter extends Vue {

    @Prop({required: true})
    initialUpvoted: boolean

    @Prop({required: true})
    postId: number

    @Prop({required: true})
    postTypeId: PostTypeId

    tappable: boolean = true

    upvoted: boolean = this.initialUpvoted

    auth: Authentication = Authentication.instance

    onTap() {
        if (!this.tappable) {
            return
        }
        this.tappable = false
        if (this.upvoted) {
            this.upvoted = false
            this.$emit('upvoteRemoved')
            Backend.instance
                .removeUpvote(this.postTypeId, this.postId)
                .catch(e => {
                    if (e.status === 422) {
                        this.$emit('upvote')
                    }
                })
                .finally(() => {
                    this.tappable = true
                })
        } else {
            this.upvoted = true
            this.$emit('upvote')
            Backend.instance
                .upvote(this.postTypeId, this.postId)
                .catch(e => {
                    if (e.response.status === 422) {
                        this.$emit('upvoteRemoved')
                    }
                })
                .finally(() => {
                    this.tappable = true
                })
        }
    }

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/tags.scss";

$body-size: 1.7em;

.upvoter {
    flex-shrink: 0;
    cursor: pointer;

    &.upvoted button ::v-deep .background {
        background-color: rgba($overwatch-button-main-bg-color, 1) !important;
        opacity: .8;
    }

    &.upvoted:hover button ::v-deep .background {
        background-color: rgba($overwatch-button-main-bg-color, 1) !important;
        opacity: 1;
    }

    button {
        font-size: 2em;
        @include overwatch-button;
        @include overwatch-futura;
        width: $body-size;
        height: $body-size;
        position: relative;
        border-radius: 50%;

        & ::v-deep .background {
            background-color: $overwatch-button-default-bg-color;
            border-radius: 50%;
        }

        &:hover ::v-deep .background {
            background-color: rgba($overwatch-button-default-bg-color, 1);
            opacity: 1;
        }

        & ::v-deep .content {
            padding: 0;
        }

        img {
            position: relative;
            height: .7em;
            top: -$body-size * .09;
            vertical-align: middle;
        }
    }

}
</style>
