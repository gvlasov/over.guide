<template>
    <div>
        <DescriptorBuilder
                :search-button-enabled="false"
                :descriptor="descriptor"
                @search="onSearch"
                @descriptorChange="onSearch"
        />
        <div class="guide-feed">
            <div v-for="guide in guides">
                <Guide :guide="guide"/>
            </div>
        </div>
        <InfiniteLoading
                ref="infiniteLoading"
                direction="bottom"
                @infinite="infiniteHandler"
        />
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading'
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
    import Guide from "@/vue/guides/Guide";
    import GuideVso from "@/js/vso/GuideVso";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
    import HeroId from "data/HeroId";
    import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";

    const backend = new Backend(axios);
    export default {
        props: {},
        methods: {
            async onSearch() {
                this.guides = [];
                this.page = 0;
                this.alreadyLoadedGuideIds = [];
                this.$refs.infiniteLoading.stateChanger.reset();
            },
            async infiniteHandler($state) {
                console.log(this.descriptor)
                await backend.searchGuidesPaginated({
                    playerHeroes: this.descriptor.players.heroes.map(it => it.id),
                    allyHeroes: this.descriptor.allies.heroes.map(it => it.id),
                    enemyHeroes: this.descriptor.enemies.heroes.map(it => it.id),
                    playerAbilities: this.descriptor.players.abilities.map(it => it.id),
                    allyAbilities: this.descriptor.allies.abilities.map(it => it.id),
                    enemyAbilities: this.descriptor.enemies.abilities.map(it => it.id),
                    mapTags: this.descriptor.maps.map(it => it.id),
                    thematicTags: this.descriptor.thematicTags.map(it => it.id),
                    pageNumber: this.pageNumber,
                    clientAlreadyHasGuideIds: this.alreadyLoadedGuideIds,
                })
                    .then(page => {
                        this.page = page.pageNumber;
                        this.guides.push(...page.guides.map(guide => new GuideVso(guide)));
                        this.alreadyLoadedGuideIds.push(...page.guides.map(guide => guide.guideId))
                        if (page.hasNextPage === false) {
                            $state.complete()
                        } else {
                            $state.loaded()
                        }
                    })
            }
        },
        data() {
            return {
                guides: [],
                descriptor: new GuideDescriptorVso(
                    new GuideDescriptorQuickie(
                        {
                            playerHeroes: [HeroId.Dva],
                        }
                    )
                ),
                pageNumber: 0,
                alreadyLoadedGuideIds: []
            }
        },
        components: {
            DescriptorBuilder,
            InfiniteLoading,
            Guide,
        },
    };

</script>

<style scoped>
    @import '~@/assets/css/fonts.css';

    .guide-feed {
        display: flex;
        justify-content: start;
        flex-direction: column;
        gap: 2em;
    }
</style>
