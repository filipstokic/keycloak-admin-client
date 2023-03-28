import {
  Controller,
  Get
} from '@nestjs/common'
import { KeycloakService } from './keycloack.service'

@Controller()
export class AppController {
  constructor(private readonly keyclaok: KeycloakService) {}

  @Get()
  async test() {
    this.keyclaok.fetchToken();
  }
  
}
