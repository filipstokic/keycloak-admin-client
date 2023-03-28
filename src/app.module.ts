import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { KeycloakService } from './keycloack.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [KeycloakService],
})
export class AppModule {}
