import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {databaseProviders} from './database/database.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [...databaseProviders, AppService],
})
export class AppModule {
}
