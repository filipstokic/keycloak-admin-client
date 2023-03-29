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
    // const roels = await client.roles.find();
    // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", roels)


    const users = await client.users.find({email: "admin@intranet.com"});
    const userId = users[0].id;

    let roleMapings = await client.users.listRoleMappings({id: userId});
    console.log('#### INIT ROLE MAPPINGS: ', roleMapings);

    const searchedRoles = await client.roles.find({search: "test123"});
    console.log('#### SEARCHED ROLES: ', searchedRoles);

    const newRoleMapping = await client.users.addRealmRoleMappings({id: userId, roles: [{id: searchedRoles[0].id, name: searchedRoles[0].name}]});

    console.log('#### ADDING ROLE MAPPINGS: ', newRoleMapping);

    roleMapings = await client.users.listRoleMappings({id: userId});
    console.log('#### NEW ROLE MAPPINGS: ', roleMapings);

    await client.users.delRealmRoleMappings({id: userId, roles: [{id: searchedRoles[0].id, name: searchedRoles[0].name}]});

    roleMapings = await client.users.listRoleMappings({id: userId});
    console.log('#### ROLE MAPPINGS AFTER DELETE: ', roleMapings);
    console.log('\n');
    const availableMappings = await client.users.listAvailableRealmRoleMappings({id: userId});
    console.log(availableMappings);
  }
}
