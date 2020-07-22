import maps from 'data/maps'
import {Map as MapModel} from "src/database/models/Map"
import MapDto from 'data/dto/Map'

export default async () => {
    await Promise.all(
        Array.from<MapDto>(maps.values()).map(
            map => {
                MapModel.create({
                    id: map.id,
                    name: map.name,
                    type: map.type,
                    dataName: map.dataName
                })
            }
        )
    )
}