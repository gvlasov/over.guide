import {ForeignKey, Model, Table,} from 'sequelize-typescript';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {Map} from "src/database/models/Map";

@Table({
    name: {
        singular: 'GuideDescriptor2Map',
        plural: 'GuideDescriptor2Map',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2Map extends Model<GuideDescriptor2Map> {

    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @ForeignKey(() => Map)
    mapId: number

}