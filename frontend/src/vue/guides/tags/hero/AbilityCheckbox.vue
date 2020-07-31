<template>
    <tr
            v-hammer:tap="updateInput"
            v-bind:class="{ checked: shouldBeChecked }"
            class="ability"
    >
        <td>
            <input
                    type="checkbox"
                    ref="checkbox"
                    :checked="shouldBeChecked"
                    :value="value"
                    @change="updateInput"
                    class="hidden-checkbox"
            />
            <AbilityIcon
                    :ability="value"
                    class="ability-icon"
            />
        </td>
        <td class="ability-name">{{value.name}}</td>
    </tr>
</template>

<script>
    import AbilityIcon from "@/vue/AbilityIcon";

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
                type: Object,
                required: true
            },
        },
        methods: {
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
        components: {
            AbilityIcon,
        },
    };

</script>

<style scoped>
    @import '~@/assets/css/fonts.css';

    .ability-name {
        color: white;
        font-family: 'Futura Demi Bold', 'sans-serif';
        font-size: 2.0em;
        line-height: .4em;
        font-variant: all-small-caps;
        width: 11em;
    }

    .ability {
        cursor: pointer;
        background-color: hsl(200, 40%, 25%);
    }

    .ability:hover {
        width: 110%;
        min-width: 110%;
    }

    .ability-passive {

    }

    .ability > td {
        padding: .36em .36em .36em .36em;
        height: 1.7em;
    }

    .ability-icon {
        max-height: 3em;
        width: auto;
        max-width: 6em;
    }

    .checked {
        background-color: hsl(200, 80%, 35%);
        box-shadow: 0 0 .1em .1em white;
    }

    .hidden-checkbox {
        display: none;
    }
</style>
