import thematicTags from 'data/thematicTags'
import {ThematicTag as ThematicTagModel} from "src/database/models/ThematicTag"
import ThematicTagDto from 'data/dto/ThematicTagDto'

export default async () => {
    return Promise.all(
        Array.from<ThematicTagDto>(thematicTags.values()).map(
            tag => {
                return ThematicTagModel.create({
                    id: tag.id,
                    name: tag.name,
                    dataName: tag.dataName
                })
            }
        )
    )
}