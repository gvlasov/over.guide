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
                v-hammer:tap="onSubmitTap"
                :disabled="message.length === 0"
        >{{ submitButtonText }}
        </OverwatchButton>
        <OverwatchButton
                type="default"
                class="close-button"
                v-hammer:tap="() => $emit('cancel')"
        >{{ closeButtonText }}
        </OverwatchButton>
        <div
                v-if="errorMessage !== null"
                class="error"
        >{{ errorMessage }}
        </div>
    </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import {Prop, Ref} from "vue-property-decorator";
import Backend from "@/ts/Backend";
import axios from 'axios';
import CommentHider from "@/vue/comments/CommentHider.vue";
import Authentication from "@/ts/Authentication";
import LoginRequirement from "@/vue/LoginRequirement.vue";

const backend = new Backend(axios)
@Component({
    components: {
        LoginRequirement,
        CommentHider,
        OverwatchButton,
    }
})
export default class CommentForm extends Vue {

    @Ref('textarea') textarea: HTMLTextAreaElement

    @Prop({default: 'cancel'})
    closeButtonText: string

    @Prop({required: true})
    submitButtonText: string

    message: string = ''

    @Prop({default: () => null})
    errorMessage: string|null

    auth: Authentication = Authentication.instance

    onSubmitTap(e) {
        this.$emit('submit', this.message);
        this.message = ''
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
    flex-wrap: wrap;
    gap: .5em;

    .textarea-wrap {
        position: relative;
        box-sizing: border-box;
        flex-shrink: 0;
        flex-grow: 1;
        flex-basis: 17em;

        textarea {
            @include standard-textarea;
            box-sizing: border-box;
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

    .error {
        padding: .3em;
        background-color: hsla(0, 66%, 41%, .3);
    }
}
</style>
