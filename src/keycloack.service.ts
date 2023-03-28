import { Injectable } from '@nestjs/common';
import { Credentials } from './keycloak/auth';
import { KeycloakAdminClient } from './keycloak/client';

@Injectable()
export class KeycloakService {
  async fetchToken() {
    const client = new KeycloakAdminClient({
      baseUrl: 'http://localhost:8280',
      realmName: 'master',
    });

    const credentials: Credentials = {
      username: 'admin',
      password: 'password',
      grantType: 'password',
      clientId: 'admin-cli',
    };

    await client.auth(credentials);
    client.setConfig({realmName: 'dev'});
    // const roels = await client.roles.findOneByName({name: 'user'});
    // const roels = await client.roles.create({clientRole: false, name: 'test123'});
    const roels = await client.roles.find();
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", roels)
  }
}
