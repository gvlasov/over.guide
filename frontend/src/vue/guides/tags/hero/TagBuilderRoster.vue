<template>
    <div class="roster-fixedbox">
        <div class="roster-fixedbox-bg"/>
        <div class="select-wrap">
            <Roster
                    @selectedHeroesChange="emitChange"
                    :selected-heroes="selectedHeroes"
                    class="roster"
            />
            <div class="button-wrap">
                <OverwatchButton
                        type="main"
                        v-hammer:tap="onSaveTap"
                        class="hanging-button"
                >Save
                </OverwatchButton>
                <OverwatchButton
                        type="default"
                        v-hammer:tap="onClearTap"
                        class="hanging-button"
                >Clear
                </OverwatchButton>
            </div>
        </div>
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
    import Roster from "@/vue/Roster";
    import OverwatchButton from "@/vue/OverwatchButton";


    export default {
        model: {
            prop: 'selectedHeroes',
            event: 'selectedHeroesChange',
        },
        props: {
            selectedHeroes: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                selecting: null,
            };
        },
        methods: {
            emitChange($event) {
                this.$emit('selectedHeroesChange', $event);
            },
            onTap() {
                this.$emit('save');
            },
        },
        computed: {},
        components: {
            OverwatchButton,
            TagGroupInvite,
            TagGroupBackground,
            TagGroupFrame,
            TagPortrait,
            Roster,
        },
    };

</script>

<style scoped>

    .select-wrap {
        position: relative;
        top: 50%;
        transform: translate(0, -50%);
    }

    .roster {
        margin-bottom: 2rem;
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .tag-type-links-wrap > a:hover > .portrait {
        transform: scale(1.4);
    }

    .roster-fixedbox {
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        margin: auto;
    }

    .roster-fixedbox-bg {
        opacity: .9;
        background-color: black;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .roster-fixedbox-bg:hover {
        opacity: .82;
        animation: bgopacity .25s;
    }

    @keyframes bgopacity {
        0% {
            opacity: .9
        }
        100% {
            opacity: .82
        }
    }

    .button-wrap {
        position: absolute;
        bottom: -5rem;
        left: 50%;
        padding-top: 4rem;
        transform: translate(-50%);
        z-index: 1000;
    }

</style>
