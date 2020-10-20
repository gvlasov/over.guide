import {Hero} from "./models/Hero";
import {Patch} from "./models/Patch";
import {Ability} from "./models/Ability";
import {MatchupEvaluation} from "./models/MatchupEvaluation";
import {YoutubeVideoExcerpt} from "./models/YoutubeVideoExcerpt";
import {User} from "src/database/models/User";
import {Guide} from "src/database/models/Guide";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuideDescriptor2TeammateHero} from "src/database/models/GuideDescriptor2TeammateHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import {GuideDescriptor2Map} from "src/database/models/GuideDescriptor2Map";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2ThematicTag} from "src/database/models/GuideDescriptor2ThematicTag";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {Map} from "src/database/models/Map";
import {ThematicTag} from "src/database/models/ThematicTag";
import {GuideHead} from "src/database/models/GuideHead";
import {GuideDescriptor2PlayerAbility} from "src/database/models/GuideDescriptor2PlayerAbility";
import {GuideDescriptor2TeammateAbility} from "src/database/models/GuideDescriptor2TeammateAbility";
import {GuideDescriptor2EnemyAbility} from "src/database/models/GuideDescriptor2EnemyAbility";
import {User2TrainingGoal} from "src/database/models/User2TrainingGoal";
import {Comment} from "src/database/models/Comment";
import {Vote} from "src/database/models/Vote";
import {GuideHeadLink} from "src/database/models/GuideHeadLink";
import {Report} from "src/database/models/Report";
import {Sentence} from "src/database/models/Sentence";
import {ImmediateAction} from "src/database/models/ImmediateAction";
import {Restriction} from "src/database/models/Restriction";
import {Notification} from "src/database/models/Notification";

export default [
    Comment,
    Hero,
    Patch,
    Ability,
    MatchupEvaluation,
    YoutubeVideoExcerpt,
    User,
    Guide,
    GuideDescriptor,
    GuideDescriptor2PlayerHero,
    GuideDescriptor2TeammateHero,
    GuideDescriptor2EnemyHero,
    GuideDescriptor2PlayerAbility,
    GuideDescriptor2TeammateAbility,
    GuideDescriptor2EnemyAbility,
    GuideDescriptor2Map,
    GuideDescriptor2ThematicTag,
    GuideHistoryEntry,
    GuideHistoryEntry2GuidePartText,
    GuideHistoryEntry2GuidePartVideo,
    GuidePartText,
    GuidePartVideo,
    Map,
    ThematicTag,
    GuideHead,
    GuideHeadLink,
    User2TrainingGoal,
    Vote,
    Report,
    Sentence,
    ImmediateAction,
    Restriction,
    Notification,
];
