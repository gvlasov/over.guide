import {ModuleRef} from "@nestjs/core";
import {Patch} from "src/database/models/Patch";

export default async (moduleRef: ModuleRef) => {
    await Patch.create({
        version: '1.3.21',
        date: new Date('2020-01-01 12:00:00'),
        title: 'The Patch',
    })
}