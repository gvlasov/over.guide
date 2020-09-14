import GuideVso from "@/js/vso/GuideVso";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import axios from 'axios';
import Backend from "@/js/Backend";

const backend = new Backend(axios);

export default  {
    props: {
        descriptor: {
            type: GuideDescriptorVso,
            required: true
        },
    },
    methods: {
        async infiniteHandler($state) {
            await backend.searchGuidesPaginated({
                playerHeroes: this.descriptor.players.heroes.map(it => it.id),
                teammateHeroes: this.descriptor.teammates.heroes.map(it => it.id),
                enemyHeroes: this.descriptor.enemies.heroes.map(it => it.id),
                playerAbilities: this.descriptor.players.abilities.map(it => it.id),
                teammateAbilities: this.descriptor.teammates.abilities.map(it => it.id),
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
                    if (this.guides.length > 0) {
                        $state.loaded()
                    }
                    if (page.hasNextPage === false) {
                        $state.complete()
                    }
                    this.hasNextPage = page.hasNextPage
                })
        },
        resetInfiniteLoading() {
            this.guides = [];
            this.page = 0;
            this.alreadyLoadedGuideIds = [];
            if (this.$refs.infiniteLoading) {
                this.$refs.infiniteLoading.stateChanger.reset();
            }
            this.hasNextPage = null;
        },
    },
    data() {
        return {
            guides: [],
            pageNumber: 0,
            alreadyLoadedGuideIds: [],
            hasNextPage: null,
        };
    },
    watch: {
        descriptor() {
            this.resetInfiniteLoading();
        }
    }
}