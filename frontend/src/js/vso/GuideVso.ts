import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";
import UserVso from "@/js/vso/UserVso";
import UserDto from "data/dto/UserDto";
import GuideTopic from "@/js/GuideTopic";

export default class GuideVso {
    public guideId: number;
    public author: UserVso|undefined;
    public descriptor: GuideDescriptorVso;
    public createdAt: string|undefined;
    public parts: (GuidePartTextWidget | GuidePartVideoWidget)[];

    constructor(entry: GuideHistoryEntryDto) {
        this.guideId = entry.guideId as number;
        this.author = entry.author && new UserVso(entry.author as UserDto);
        this.descriptor = new GuideDescriptorVso(entry.descriptor)
        this.createdAt = entry.createdAt && entry.createdAt as string;
        this.parts = entry.parts.map(
            part =>
                part.kind === 'text'
                    ? new GuidePartTextWidget(part)
                    : new GuidePartVideoWidget(part)
        );
    }

    get topic(): GuideTopic {
        return new GuideTopic(this.guideId)
    }

    get isEmpty(): boolean {
        return this.descriptor.isEmpty && this.parts.length === 0;
    }

    toDto(): GuideHistoryEntryDto {
        return {
            guideId: this.guideId,
                descriptor: {
            playerHeroes:
                this.descriptor.players.heroes.map(hero => hero.id),
                    teammateHeroes:
            this.descriptor.teammates.heroes.map(hero => hero.id),
                enemyHeroes:
            this.descriptor.enemies.heroes.map(hero => hero.id),
                playerAbilities:
            this.descriptor.players.abilities.map(ability => ability.id),
                teammateAbilities:
            this.descriptor.teammates.abilities.map(ability => ability.id),
                enemyAbilities:
            this.descriptor.enemies.abilities.map(ability => ability.id),
                mapTags: this.descriptor.maps.map(vso => vso.id),
                thematicTags: this.descriptor.thematicTags.map(vso => vso.id),
        },
            parts: this.parts.map(widget => widget.part)
        } as GuideHistoryEntryDto
    }

}

