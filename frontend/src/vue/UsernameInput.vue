<template>
    <form @submit="onFormSubmit">
        <input
                type='text'
                :value="username"
                @input="onInput"
                v-bind:class="{'error-input' : !valid}"
        />
        <div class="validation" v-if="!valid">
            <div class="error">Name must be between 3-12 characters</div>
        </div>
    </form>
</template>

<script>
import TrainingGoal from "@/vue/guides/TrainingGoal";
import OverwatchButton from "@/vue/OverwatchButton";
import axios from 'axios';
import Backend from "@/js/Backend";
import Cookies from 'js-cookie';
import Guide from "@/vue/guides/Guide";

const backend = new Backend(axios);
export default {
    model: {
        prop: 'username',
        event: 'input'
    },
    props: {
        username: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            initialUsername: undefined,
            validationEnabled: false,
            valid: true,
        };
    },
    methods: {
        onInput(e) {
            this.$emit('input', e.target.value)
            if (this.validationEnabled) {
                this.validate();
            }
        },
        onFormSubmit(e) {
            e.preventDefault();
            const newUsername = this.username;
            this.validate();
            if (this.valid) {
                backend.changeUsername(newUsername)
                    .then(result => {
                        Cookies.set('username', newUsername);
                        this.initialUsername = newUsername
                        window.location.reload();
                    })
                    .catch(e => {
                        this.$emit('usernameRevert', this.initialUsername);
                    });
            }
            return false
        },
        validate() {
            this.valid = this.username.length >= 3 && this.username.length <= 12;
            this.validationEnabled = !this.valid;
        },
    },
    async mounted() {
        this.initialUsername = this.username;
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

        .error {
            color: $tag-player-color;
            padding: .1em .8em;
        }
    }
}
</style>
