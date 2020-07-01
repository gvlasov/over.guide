import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {databaseProviders} from './database/database.providers';
import {SuggestPickController} from './controllers/suggest-pick.controller';
import {MatchupEvaluationController} from './controllers/matchup-evaluation.controller';
import {YoutubeVideoExcerptController} from './controllers/youtube-video-excerpt.controller';
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import {SuggestPickService} from "src/services/suggest-pick.service";

@Module({
    imports: [DatabaseModule],
    controllers: [
        AppController,
        SuggestPickController,
        MatchupEvaluationController,
        YoutubeVideoExcerptController,
    ],
    providers: [
        ...databaseProviders,
        AppService,
        MatchupEvaluationService,
        SuggestPickService,
    ],
})
export class AppModule {
}
