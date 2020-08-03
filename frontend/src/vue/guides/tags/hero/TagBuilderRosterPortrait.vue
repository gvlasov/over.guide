<template>
    <RosterPortrait
            class="roster-portrait"
            :hero="hero"
            :banned="false"
            :selected-out="false"
            :selected="selected"
            v-flex-touch="(e) => e.preventDefault()"
            @heroSelect="bubbleHeroSelect"
            v-bind:data-hero-data-name="hero.dataName"
            v-bind:class="{ 'selected': selected }"
    >
        <template v-slot:bottom>
            <OverwatchButton
                    v-if="selected"
                    v-hammer:tap="onSkillsButtonTap"
                    type="default"
                    class="skills-button"
            >{{abilities.length > 0 ? abilities.length : 'skills'}}
            </OverwatchButton>
        </template>
    </RosterPortrait>
</template>

<script>
    import HeroPortraitSkewed from "@/vue/HeroPortraitSkewed.vue";
    import RosterPortrait from "@/vue/RosterPortrait";
    import OverwatchButton from "@/vue/OverwatchButton";

    export default {
        props: {
            hero: Object,
            selected: {
                type: Boolean,
                default: false,
            },
            abilities: {
                type: Array,
                required: true,
            },
            tagGroupAbilities: {
                type: Array,
                required: true,
            },
        },
        watch: {
            selected(value) {
                if (value === false) {
                    this.tagGroupAbilities.replaceAll(
                        [...this.tagGroupAbilities].filter(
                            ability => ability.hero.id !== this.hero.id
                        )
                    );
                }
            }
        },
        methods: {
            bubbleHeroSelect() {
                this.$emit('heroSelect', this.hero)
            },
            onSkillsButtonTap() {
                this.$emit('skillSelectionStart', this.hero)
            }
        },
        computed: {},
        data() {
            return {}
        },
        components: {
            OverwatchButton,
            RosterPortrait,
            HeroPortraitSkewed,
        },
    };

</script>

<style scoped>
    .roster-portrait {
        width: 7vw;
        height: 7vw;
        margin: 0.2vw;
    }

    .skills-button {
        position: absolute;
        bottom: 0;
        left: 1.3em;
        font-size: 1.17em;
    }
</style>
