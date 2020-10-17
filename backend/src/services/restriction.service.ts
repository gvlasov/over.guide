import {Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";
import RestrictionTypeId from "data/RestrictionTypeId";
import {Sentence} from "src/database/models/Sentence";
import {Restriction} from "src/database/models/Restriction";
import {Op} from "sequelize";


@Injectable()
export class RestrictionService {

    constructor() {
    }

    async hasActiveRestriction(
        user: User,
        restrictionType: RestrictionTypeId,
        objectId: number|null = null
    ): Promise<boolean> {
        return Sentence.findOne({
            where: {
                defenderId: user.id,
            },
            include: [
                {
                    model: Restriction,
                    as: 'restrictions',
                    required: true,
                    where: {
                        typeId: restrictionType,
                        objectId: objectId,
                        end: {
                            [Op.gt]: new Date().toISOString()
                        },
                    }
                }
            ],
        })
            .then(sentence => {
                return sentence !== null;
            })
    }

}
