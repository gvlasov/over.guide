import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {databaseProviders} from './database/database.providers';
import {SuggestPickController} from './controllers/suggest-pick.controller';
import {MatchupEvaluationController} from './controllers/matchup-evaluation.controller';
import {YoutubeVideoExcerptController} from './controllers/youtube-video-excerpt.controller';
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import {SuggestPickService} from "src/services/suggest-pick.service";
import {BattlenetAuthController} from "src/controllers/battlenet-auth.controller";
import {BattlenetService} from "src/services/battlenet.service";
import {TokenService} from "src/services/token.service";
import {TestController} from "src/controllers/test.controller";
import {FixtureController} from "src/controllers/fixture.controller";
import {FixtureService} from "src/services/fixture.service";
import {AuthService} from "src/services/auth.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {ModerationService} from "src/services/moderation.service";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {GuideController} from "src/controllers/guide.controller";

@Module({
    imports: [DatabaseModule, HttpModule],
    controllers: [
        AppController,
        SuggestPickController,
        MatchupEvaluationController,
        YoutubeVideoExcerptController,
        BattlenetAuthController,
        GuideController,
        TestController,
        FixtureController,
    ],
    providers: [
        ...databaseProviders,
        AppService,
        MatchupEvaluationService,
        AuthService,
        SuggestPickService,
        BattlenetService,
        TokenService,
        FixtureService,
        GuideHistoryEntryService,
        GuideDescriptorService,
        ModerationService,
    ],
})
export class AppModule {
}
