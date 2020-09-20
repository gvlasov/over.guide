import GuideVso from "@/ts/vso/GuideVso";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import axios from 'axios';
import Backend from "@/ts/Backend";
import Vue from 'vue'
import {Prop, Watch} from "vue-property-decorator";
import Component from "vue-class-component";

const backend = new Backend(axios);

type InfiniteHandlerState = {
    complete: () => void,
    error: () => void,
    loaded: () => void,
    reset: () => void
};
@Component({})
export default class InfiniteGuideSearchMixin extends Vue {

    @Prop({required: true})
    descriptor!: GuideDescriptorVso

    guides: GuideVso[] = []
    page: number = 0
    alreadyLoadedGuideIds: number[] = []
    hasNextPage: boolean | null = null
    exact: boolean = false

    async infiniteHandler($state: InfiniteHandlerState) {
        await backend.searchGuidesPaginated({
            playerHeroes: this.descriptor.players.heroes.map(it => it.id),
            teammateHeroes: this.descriptor.teammates.heroes.map(it => it.id),
            enemyHeroes: this.descriptor.enemies.heroes.map(it => it.id),
            playerAbilities: this.descriptor.players.abilities.map(it => it.id),
            teammateAbilities: this.descriptor.teammates.abilities.map(it => it.id),
            enemyAbilities: this.descriptor.enemies.abilities.map(it => it.id),
            mapTags: this.descriptor.maps.map(it => it.id),
            thematicTags: this.descriptor.thematicTags.map(it => it.id),
            pageNumber: this.page,
            clientAlreadyHasGuideIds: this.alreadyLoadedGuideIds,
            exact: this.exact,
        })
            .then(page => {
                this.page = page.pageNumber;
                this.guides.push(...page.guides.map(guide => new GuideVso(guide)));
                this.alreadyLoadedGuideIds.push(...page.guides.map(guide => guide.guideId as number))
                if (this.guides.length > 0) {
                    $state.loaded()
                }
                if (page.hasNextPage === false) {
                    $state.complete()
                }
                this.hasNextPage = page.hasNextPage
            })
    }

    resetInfiniteLoading() {
        this.guides = [];
        this.page = 0;
        this.alreadyLoadedGuideIds = [];
        if (this.$refs.infiniteLoading) {
            (this.$refs.infiniteLoading as any).stateChanger.reset();
        }
        this.hasNextPage = null;
    }

    @Watch('descriptor')
    onDescriptorChange(newValue: GuideDescriptorVso) {
        this.resetInfiniteLoading();
    }
}
