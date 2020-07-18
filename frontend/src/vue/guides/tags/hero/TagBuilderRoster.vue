<template>
    <div class="roster-fixedbox">
        <div class="roster-fixedbox-bg"/>
        <div class="select-wrap">
            <Roster
                    @selectedHeroesChange="emitChange"
                    :selected-heroes="selectedHeroes"
                    class="roster"
            />
            <OverwatchButton
                    type="main"
                    v-hammer:tap="onTap"
            >Save
            </OverwatchButton>
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
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
    }

    .roster {
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
        overflow: auto;
        margin: auto;
    }

    .roster-fixedbox-bg {
        opacity: .8;
        background-color: black;
        position: absolute;
        width: 100%;
        height: 100%;
    }

</style>
