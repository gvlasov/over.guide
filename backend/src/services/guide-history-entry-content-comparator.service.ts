import {Injectable} from '@nestjs/common';
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntry";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import GuidePartName from "data/dto/GuidePartName";
import GuidePartVideoDto from "data/dto/GuidePartVideo";
import GuidePartTextDto from "data/dto/GuidePartText";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";

@Injectable()
export class GuideHistoryEntryContentComparatorService {

    constructor() {
    }


    async isContentSame(
        dto: GuideHistoryEntryDto,
        entry: GuideHistoryEntry
    ): Promise<boolean> {
        return dto.guideId === entry.guideId
            && await this.areThematicTagsSame(dto, entry)
            && await this.areMapsSame(dto, entry)
            && await this.arePlayerHeroesSame(dto, entry)
            && await this.areAllyHeroesSame(dto, entry)
            && await this.areEnemyHeroesSame(dto, entry)
            && await this.areGuidePartsSame(dto, entry)
    }

    private async areGuidePartsSame(
        dto: GuideHistoryEntryDto,
        entry: GuideHistoryEntry
    ) {
        const separator = '|';
        const dtoSerialized = dto.parts
            .map(part => JSON.stringify(part))
            .join(separator);
        type DbPart = (GuidePartText & { pivot: GuideHistoryEntry2GuidePartText }
            | GuidePartVideo & { pivot: GuideHistoryEntry2GuidePartVideo })
        const dbSerialized = [
            ...(await entry.$get('guidePartTexts')),
            ...(await entry.$get('guidePartVideos'))
        ]
            .sort(
                (a: DbPart, b: DbPart) => a.pivot.order - b.pivot.order
            )
            .map(async (part: DbPart) => {
                if (part instanceof GuidePartText) {
                    return {
                        kind: GuidePartName.Text,
                        contentMd: part.contentMd,
                    } as GuidePartTextDto
                } else if (part instanceof GuidePartVideo) {
                    const excerpt = await part.$get('excerpt');
                    return {
                        excerpt: {
                            endSeconds: excerpt.endSeconds,
                            startSeconds: excerpt.endSeconds,
                            youtubeVideoId: excerpt.youtubeVideoId
                        },
                        kind: GuidePartName.Video,
                    } as GuidePartVideoDto
                } else {
                    throw new Error('Unknown type of part')
                }
            })
            .map(partDto => JSON.stringify(partDto))
            .join(separator)
        return dtoSerialized === dbSerialized
    }

    private async areEnemyHeroesSame(
        gheDto: GuideHistoryEntryDto,
        oldEntry: GuideHistoryEntry
    ) {
        const dtoSerializied = gheDto.descriptor.enemyHeroes.join(',');
        const dbSerialized = await oldEntry
            .$get('descriptor')
            .then(d => d.$get('enemies'))
            .then(enemy => enemy.map(h => h.id).join(','));
        return dtoSerializied === dbSerialized;
    }

    private async areAllyHeroesSame(
        gheDto: GuideHistoryEntryDto,
        oldEntry: GuideHistoryEntry
    ): Promise<boolean> {
        const dtoSerialized = gheDto.descriptor.allyHeroes.join(',');
        const dbSerialized = await oldEntry
            .$get('descriptor')
            .then(d => d.$get('allies'))
            .then(ally => ally.map(h => h.id).join(','));
        return dtoSerialized === dbSerialized;
    }

    private async arePlayerHeroesSame(
        gheDto: GuideHistoryEntryDto,
        oldEntry: GuideHistoryEntry
    ): Promise<boolean> {
        const dtoSerialized = gheDto.descriptor.playerHeroes.join(',');
        const dbSerialized = await oldEntry.$get('descriptor')
            .then(d => d.$get('players'))
            .then(player => player.map(h => h.id).join(','));
        return dtoSerialized === dbSerialized;
    }

    private async areMapsSame(gheDto: GuideHistoryEntryDto, oldEntry: GuideHistoryEntry) {
        const dtoSerialized = gheDto.descriptor.mapTags.join(',');
        const dbSerialized = await oldEntry.$get('descriptor')
            .then(d => d.$get('maps'))
            .then(map => map.map(map => map.id).join(','));
        return dtoSerialized === dbSerialized;
    }

    private async areThematicTagsSame(
        gheDto: GuideHistoryEntryDto,
        oldEntry: GuideHistoryEntry
    ): Promise<boolean> {
        const dtoSerialized = gheDto.descriptor.thematicTags.join(',');
        const dbSerialized = await oldEntry
            .$get('descriptor')
            .then(d => d.$get('thematicTags'))
            .then(tags => tags.map(tag => tag.id).join(','));
        return dtoSerialized === dbSerialized;
    }
}
