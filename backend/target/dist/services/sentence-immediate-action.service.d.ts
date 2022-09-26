import { Sentence } from "src/database/models/Sentence";
import ImmediateActionCreateDto from "data/dto/ImmediateActionCreateDto";
import { ImmediateAction } from "src/database/models/ImmediateAction";
import { User } from "src/database/models/User";
export declare class SentenceImmediateActionService {
    constructor();
    issueActions(issuer: User, sentence: Sentence, actions: ImmediateActionCreateDto[]): Promise<ImmediateAction[]>;
    private deactivateAllGuides;
    private deactivateGuide;
    private deleteAllGuideComments;
    private deleteComment;
    private ignoreAllCurrentReports;
    private banAccount;
    private makeGuidePrivate;
}
