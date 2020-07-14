<template>
    <div
            class="role"
            v-hammer:tap="updateInput"
            v-bind:class="{ checked: shouldBeChecked }"
            v-bind:data-role="roleName(value)"
    >
        <input
                type="checkbox"
                ref="checkbox"
                :checked="shouldBeChecked"
                :value="value"
                @change="updateInput"
                class="hidden-checkbox"
        />
        <img
                v-bind:src="'/images/' + roleName(value) + '.svg'"
        />
        <div>{{ roleName(value) }}</div>
    </div>
</template>

<script>
    import Role from "data/Role";

    export default {
        model: {
            prop: 'modelValue',
            event: 'change',
        },
        props: {
            modelValue: {
                default: () => [],
            },
            value: {
                type: Number,
                required: true
            },
        },
        methods: {
            /**
             * @param {Role} value
             * @return {string}
             */
            roleName(value) {
                return Role[value].toLowerCase();
            },
            onTap() {
            },
            updateInput(event) {
                let isChecked = !this.$refs.checkbox.checked;

                let newValue = [...this.modelValue];

                if (isChecked) {
                    newValue.push(this.value)
                } else {
                    newValue.splice(newValue.indexOf(this.value), 1)
                }
                this.$refs.checkbox.checked = !this.$refs.checkbox.checked;

                this.$emit('change', newValue);
            }
        },
        computed: {
            shouldBeChecked() {
                return this.modelValue.includes(this.value);
            }
        },
        data() {
            return {}
        },
        components: {},
    };

</script>

<style scoped>
    @import '../../assets/css/fonts.css';

    .role {
        padding: 1vw;
        display: inline-block;
        width: 20vw;
        margin-left: 1.5vw;
        margin-right: 1.5vw;
        max-width: 20vw;
        text-align: center;
        font-family: 'Futura Demi Bold', sans-serif;
        font-size: 2.5vw;
        font-variant-caps: all-small-caps;
        background-color: white;
        cursor: pointer;
        user-select: none;
        opacity: 0.5;
    }

    .checked {
        opacity: 1;
    }

    .role > img {
        width: 9vw;
    }

    .hidden-checkbox {
        display: none;
    }
</style>
