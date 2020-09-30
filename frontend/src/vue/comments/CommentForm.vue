<template>
    <form class="comment-form" v-on:submit="onSubmit">
        <div class="textarea-wrap">
            <LoginRequirement
                    v-if="!auth.loggedIn"
            />
            <textarea
                    ref="textarea"
                    name="reply"
                    rows="5"
                    v-model="message"
                    :disabled="!auth.loggedIn"
            ></textarea>
        </div>
        <OverwatchButton
                v-if="auth.loggedIn"
                type="main"
                v-hammer:tap="sendReply"
                :disabled="message.length === 0"
        >reply
        </OverwatchButton>
        <OverwatchButton
                type="default"
                class="close-button"
                v-hammer:tap="() => $emit('cancel')"
        >{{ closeButtonText }}
        </OverwatchButton>
    </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import {Prop, Ref} from "vue-property-decorator";
import PostVso from "@/ts/vso/PostVso";
import Backend from "@/ts/Backend";
import axios from 'axios';
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentVso from "@/ts/vso/CommentVso";
import CommentHider from "@/vue/comments/CommentHider.vue";
import Authentication from "@/ts/Authentication";
import BattlenetAuthButton from "@/vue/BattlenetAuthButton.vue";
import LoginRequirement from "@/vue/LoginRequirement.vue";

const backend = new Backend(axios)
@Component({
    components: {
        LoginRequirement,
        BattlenetAuthButton,
        CommentHider,
        OverwatchButton,
    }
})
export default class CommentForm extends Vue {

    @Ref('textarea') textarea: HTMLTextAreaElement

    @Prop({required: true})
    post: PostVso

    @Prop({default: false})
    disabled: boolean

    @Prop({required: true})
    parent: CommentVso | PostVso

    @Prop({required: true})
    commentsLevel: CommentVso[]

    @Prop({default: 'cancel'})
    closeButtonText: string

    message: string = ''

    auth: Authentication = Authentication.instance

    sendReply(e) {
        this.$emit('reply')
        e.preventDefault()
        backend
            .createComment({
                postType: this.post.postType,
                postId: this.post.postId,
                parentId: this.parent instanceof CommentVso ? this.parent.id : null,
                content: this.message,
            } as CommentCreateDto)
            .then((dto) => {
                this.message = '';
                this.post.commentsCount++;
                return this.commentsLevel.unshift(new CommentVso(dto, []))
            })
        return false
    }

    onSubmit(e) {
        e.preventDefault();
        return false
    }

    mounted() {
        this.textarea.focus()
    }

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/fonts.scss";

.comment-form {
    display: flex;
    flex-wrap: nowrap;
    gap: .5em;

    .textarea-wrap {
        position: relative;
        box-sizing: border-box;
        width: 100%;

        textarea {
            @include standard-textarea;
            box-sizing: border-box;
            flex-grow: 1;
            flex-shrink: 0;
            width: 100%;
            resize: vertical;
        }

        .login-notice {
            padding: 0;
            position: absolute;
            min-height: 100%;
            min-width: 100%;
            background-color: hsla(249, 22%, 19%, .3);
            display: flex;
            flex-direction: row;
            justify-content: center;

            & ::v-deep .close-button {
                display: none;
            }

            & ::v-deep button {
                margin: 0;
            }
        }
    }

    button {
        font-size: 1.5em;
    }
}
</style>
