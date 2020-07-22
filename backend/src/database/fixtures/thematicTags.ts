import thematicTags from 'data/thematicTags'
import {ThematicTag as ThematicTagModel} from "src/database/models/ThematicTag"
import ThematicTagDto from 'data/dto/ThematicTag'

export default async () => {
    await Promise.all(
        Array.from<ThematicTagDto>(thematicTags.values()).map(
            tag => {
                ThematicTagModel.create({
                    id: tag.id,
                    name: tag.name,
                    dataName: tag.dataName
                })
            }
        )
    )
}