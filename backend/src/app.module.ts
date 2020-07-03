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

@Module({
    imports: [DatabaseModule, HttpModule],
    controllers: [
        AppController,
        SuggestPickController,
        MatchupEvaluationController,
        YoutubeVideoExcerptController,
        BattlenetAuthController,
    ],
    providers: [
        ...databaseProviders,
        AppService,
        MatchupEvaluationService,
        SuggestPickService,
        BattlenetService
    ],
})
export class AppModule {
}
