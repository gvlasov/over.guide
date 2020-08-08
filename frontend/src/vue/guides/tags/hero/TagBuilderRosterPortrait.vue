<template>
    <div class="proportional-height-wrap">
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
        </RosterPortrait>
    </div>
</template>

<script>
    import RosterPortrait from "@/vue/RosterPortrait";

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
        },
        computed: {},
        data() {
            return {}
        },
        components: {
            RosterPortrait,
        },
    };

</script>

<style scoped>
    .proportional-height-wrap {
        /* https://stackoverflow.com/a/14896313/1542343 */
        position: relative;
        width: 9.4%;
        padding-bottom: 10.6%;
        display: inline-block;
        margin: .34%;
        transform: skew(-25deg);
    }
    .roster-portrait {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: .2em;
        margin: 0;
        transform: translateX(-50%) skew(0deg);
    }
</style>
