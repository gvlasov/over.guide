<template>
    <form @submit="onFormSubmit">
        <input
                type='text'
                :value="username"
                @input="onInput"
                v-bind:class="{'error-input' : !valid}"
        />
        <div
                v-if="validationEnabled"
                class="validation"
        >
            <div
                    v-if="!isLengthValid"
            >Name must be between 3-12 characters
            </div>
            <div
                    v-if="!isUsernameAvailable"
            >Username taken
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import TrainingGoal from "@/vue/guides/TrainingGoal";
import OverwatchButton from "@/vue/OverwatchButton";
import axios from 'axios';
import Backend from "@/ts/Backend";
import Guide from "@/vue/guides/Guide";
import Authentication from "@/ts/Authentication";
import Vue from 'vue'
import {Model} from "vue-property-decorator";
import Component from "vue-class-component";

const backend = new Backend(axios);
const auth = new Authentication()
@Component({
    components: {
        Guide,
        OverwatchButton,
        TrainingGoal,
    },
})
export default class UsernameInput extends Vue {
    @Model('input', {required: true})
    username: string

    initialUsername: string | null = null
    validationEnabled: boolean = false
    takenUsernames: string[] = []

    get isLengthValid(): boolean {
        return this.username.length >= 3 && this.username.length <= 12;
    }

    get isUsernameAvailable(): boolean {
        return !this.takenUsernames.includes(this.username);
    }

    get valid(): boolean {
        return this.isLengthValid && this.isUsernameAvailable;
    }

    onInput(e) {
        this.$emit('input', e.target.value)
        if (e.target.value.length > 3) {
            this.validationEnabled = true;
        }
    }

    onFormSubmit(e : InputEvent) {
        e.preventDefault();
        if (this.valid) {
            backend.changeUsername(this.username)
                .then(result => {
                    auth.setUsername(this.username)
                    this.initialUsername = this.username
                    window.location.reload();
                })
                .catch(e => {
                    this.takenUsernames.push(this.username);
                    this.$emit('usernameRevert', this.initialUsername);
                });
        }
        return false
    }

    created() {
        this.initialUsername = this.username;
    }
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/tags.scss';

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

        &.error-input {
            opacity: .8;
        }
    }

    .validation {
        background-color: hsl(209, 18%, 35%);
        @include overwatch-futura-no-smallcaps;
        position: absolute;
        right: 0;
        top: 100%;
        margin-top: .4em;
        white-space: nowrap;
        text-align: right;

        & > div {
            color: $tag-player-color;
            padding: .1em .8em;
        }
    }
}
</style>
