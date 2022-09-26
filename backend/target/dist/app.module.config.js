"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const suggest_pick_controller_1 = require("./controllers/suggest-pick.controller");
const matchup_evaluation_controller_1 = require("./controllers/matchup-evaluation.controller");
const youtube_video_excerpt_controller_1 = require("./controllers/youtube-video-excerpt.controller");
const old_json_matchup_evaluation_service_1 = require("./services/old-json-matchup-evaluation.service");
const suggest_pick_service_1 = require("./services/suggest-pick.service");
const battlenet_auth_controller_1 = require("./controllers/battlenet-auth.controller");
const battlenet_service_1 = require("./services/battlenet.service");
const token_service_1 = require("./services/token.service");
const test_controller_1 = require("./controllers/test.controller");
const fixture_controller_1 = require("./controllers/fixture.controller");
const fixture_service_1 = require("./services/fixture.service");
const auth_service_1 = require("./services/auth.service");
const guide_descriptor_service_1 = require("./services/guide-descriptor.service");
const moderation_service_1 = require("./services/moderation.service");
const guide_history_entry_service_1 = require("./services/guide-history-entry.service");
const guide_controller_1 = require("./controllers/guide.controller");
const content_hash_service_1 = require("./services/content-hash.service");
const guide_search_service_1 = require("./services/guide-search.service");
const training_goal_controller_1 = require("./controllers/training-goal.controller");
const user_controller_1 = require("./controllers/user.controller");
const comment_controller_1 = require("./controllers/comment.controller");
const vote_controller_1 = require("./controllers/vote.controller");
const rights_service_1 = require("./services/rights.service");
const report_controller_1 = require("./controllers/report.controller");
const report_search_service_1 = require("./services/report-search.service");
const sentence_immediate_action_service_1 = require("./services/sentence-immediate-action.service");
const restriction_service_1 = require("./services/restriction.service");
const sentence_controller_1 = require("./controllers/sentence.controller");
const notification_controller_1 = require("./controllers/notification.controller");
const search_cache_service_1 = __importDefault(require("./services/search-cache.service"));
const notifications_gateway_1 = require("./controllers/notifications.gateway");
const online_users_repository_1 = require("./services/online-users.repository");
const notification_service_1 = require("./services/notification.service");
const TagIdSerivce_1 = __importDefault(require("./services/TagIdSerivce"));
const youtube_screenshot_service_1 = require("./services/youtube-screenshot.service");
const thumbnail_service_1 = require("./services/thumbnail.service");
const youtube_stream_url_service_1 = require("./services/youtube-stream-url.service");
const youtube_controller_1 = require("./controllers/youtube.controller");
const config = {
    imports: [
        database_module_1.DatabaseModule,
        common_1.HttpModule,
        common_1.CacheModule.register({
            ttl: 60,
            max: 1000,
        })
    ],
    controllers: [
        app_controller_1.AppController,
        suggest_pick_controller_1.SuggestPickController,
        matchup_evaluation_controller_1.MatchupEvaluationController,
        youtube_video_excerpt_controller_1.YoutubeVideoExcerptController,
        battlenet_auth_controller_1.BattlenetAuthController,
        guide_controller_1.GuideController,
        ...(process.env.ENV === 'dev' ? [fixture_controller_1.FixtureController, test_controller_1.TestController] : []),
        training_goal_controller_1.TrainingGoalController,
        user_controller_1.UserController,
        comment_controller_1.CommentController,
        vote_controller_1.VoteController,
        report_controller_1.ReportController,
        sentence_controller_1.SentenceController,
        notification_controller_1.NotificationController,
        youtube_controller_1.YoutubeController,
    ],
    providers: [
        app_service_1.AppService,
        old_json_matchup_evaluation_service_1.OldJsonMatchupEvaluationService,
        auth_service_1.AuthService,
        suggest_pick_service_1.SuggestPickService,
        battlenet_service_1.BattlenetService,
        token_service_1.TokenService,
        fixture_service_1.FixtureService,
        guide_history_entry_service_1.GuideHistoryEntryService,
        guide_descriptor_service_1.GuideDescriptorService,
        moderation_service_1.ModerationService,
        content_hash_service_1.ContentHashService,
        guide_search_service_1.GuideSearchService,
        rights_service_1.RightsService,
        report_search_service_1.ReportSearchService,
        sentence_immediate_action_service_1.SentenceImmediateActionService,
        restriction_service_1.RestrictionService,
        search_cache_service_1.default,
        TagIdSerivce_1.default,
        notifications_gateway_1.NotificationsGateway,
        online_users_repository_1.OnlineUsersRepository,
        notification_service_1.NotificationService,
        youtube_screenshot_service_1.YoutubeScreenshotService,
        thumbnail_service_1.ThumbnailService,
        youtube_stream_url_service_1.YoutubeStreamUrlService,
    ],
};
exports.default = config;
//# sourceMappingURL=app.module.config.js.map