import { User } from "src/database/models/User";
import RestrictionTypeId from "data/RestrictionTypeId";
export declare class RestrictionService {
    constructor();
    hasActiveRestriction(user: User, restrictionType: RestrictionTypeId, objectId?: number | null): Promise<boolean>;
}
