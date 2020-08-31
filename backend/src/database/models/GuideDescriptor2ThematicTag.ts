import {
    AllowNull,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {ThematicTag} from "src/database/models/ThematicTag";

@Table({
    name: {
        singular: 'GuideDescriptor2ThematicTag',
        plural: 'GuideDescriptor2ThematicTag',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2ThematicTag extends Model<GuideDescriptor2ThematicTag> {

    @AllowNull(false)
    @Column
    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @AllowNull(false)
    @Column
    @ForeignKey(() => ThematicTag)
    thematicTagId: number

}