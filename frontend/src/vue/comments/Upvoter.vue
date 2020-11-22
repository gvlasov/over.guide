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
            <font-awesome-icon icon="brain"/>
        </OverwatchButton>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import Authentication from "@/ts/Authentication";
import PostTypeId from "data/PostTypeId";
import UpvoteCache from "@/ts/UpvoteCache";
import AbilityIcon from "@/vue/AbilityIcon.vue";

@Component({
    components: {
        AbilityIcon,
        OverwatchButton,
    }
})
export default class Upvoter extends Vue {

    @Prop({required: true})
    postId: number

    @Prop({required: true})
    postTypeId: PostTypeId

    tappable: boolean = true

    upvoted: boolean = UpvoteCache.instance.hasUpvote(this.postTypeId, this.postId)

    auth: Authentication = Authentication.instance

    onTap() {
        if (!this.tappable) {
            return
        }
        this.tappable = false
        if (this.upvoted) {
            this.upvoted = false
            this.$emit('upvoteRemoved')
            UpvoteCache.instance
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
            UpvoteCache.instance
                .upvote(this.postTypeId, this.postId)
                // .catch(e => {
                //     if (e.response.status === 422) {
                //         this.$emit('upvoteRemoved')
                //     }
                // })
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
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
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
