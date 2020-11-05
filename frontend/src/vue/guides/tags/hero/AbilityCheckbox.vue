<template>
    <div
            v-hammer:tap="updateInput"
            v-bind:class="{ checked: shouldBeChecked }"
            class="ability-checkbox"
    >
        <HeroPortrait
                :hero="value.hero"
                :base-url="'/images/roster-portraits/'"
        />
        <div class="icon-row">
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
            <KeyIcon
                    v-for="key in value.keys"
                    :keyVso="key"
                    :key="key.dataName"
                    class="key-icon"
            />
        </div>
        <div class="ability-name">
            <div class="ability-name-align">{{ value.name }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import AbilityIcon from "@/vue/AbilityIcon";
import KeyIcon from "@/vue/KeyIcon";
import HeroPortrait from "@/vue/HeroPortrait";
import Vue from 'vue'
import {Model, Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import AbilityDto from "data/dto/AbilityDto";

@Component({
    components: {
        HeroPortrait,
        KeyIcon,
        AbilityIcon,
    },
})
export default class AbilityCheckbox extends Vue {
    @Model('change', {default: () => []})
    modelValue: AbilityDto[]

    @Prop({required: true})
    value: any

    updateInput(event) {
        const checkbox = this.$refs.checkbox as HTMLInputElement;
        let isChecked = !checkbox.checked;

        let newValue = [...this.modelValue];

        if (isChecked) {
            newValue.push(this.value)
        } else {
            const index = newValue.findIndex(elem => elem.id === this.value.id);
            if (index === -1) {
                throw new Error('Element not found');
            }
            newValue.splice(index, 1)
        }
        checkbox.checked = !checkbox.checked;
        this.$emit('change', newValue);
    }

    get shouldBeChecked() {
        return this.modelValue.find(elem => elem.id === this.value.id);
    }

}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';


.ability-checkbox {
    cursor: pointer;
    background-color: hsl(200, 40%, 25%);
    min-width: 5em;
    justify-content: space-around;
    gap: .2em;
    padding: .4em;
    position: relative;

    &.checked {
        background-color: hsl(200, 80%, 35%);
        box-shadow: 0 0 .11em .11em white;
    }

    .icon-row {
        display: flex;
        width: 100%;
        gap: .3em;
        justify-content: space-evenly;

        .hidden-checkbox {
            display: none;
        }

        .ability-icon {
            max-height: 3em;
            width: auto;
            height: auto;
            object-fit: contain;
            max-width: 6em;
            vertical-align: middle;
            z-index: 2;
        }

        .key-icon {
            vertical-align: middle;
            z-index: 2;
        }
    }

    .ability-name {
        display: block;
        color: white;
        font-family: 'Futura Demi Bold', 'sans-serif';
        font-size: 1.4em;
        font-variant: all-small-caps;
        min-width: 3em;
        .ability-name-align {
            display: inline-block;
            height: 100%;
            vertical-align: middle;
            z-index: 2;
            position: relative;
            margin-right: 1.1em;
        }
    }

    .hero-portrait {
        height: 30%;
        width: auto;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 1;
    }

}

</style>
