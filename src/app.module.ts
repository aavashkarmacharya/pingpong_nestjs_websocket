import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { websocketgateway } from './chatgateway/chat.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, websocketgateway],
})
export class AppModule {}
