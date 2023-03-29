import { RequestArgs } from "./agent";
import { Credentials, getToken } from "./auth";
import { Roles } from "./resources/roles";
import { Users } from "./resources/users";

export interface ConnectionConfig {
  baseUrl?: string;
  realmName?: string;
  requestOptions?: RequestInit;
  requestArgOptions?: Pick<RequestArgs, "catchNotFound">;
}


export const defaultBaseUrl = "http://127.0.0.1:8180";
export const defaultRealm = "master";

export class KeycloakAdminClient {

  public baseUrl: string;
  public realmName: string;
  public accessToken?: string;
  public refreshToken?: string;

  public roles: Roles;
  public users: Users;

  private requestOptions?: RequestInit;
  private globalRequestArgOptions?: Pick<RequestArgs, "catchNotFound">;

  constructor(connectionConfig?: ConnectionConfig) {
    this.baseUrl = connectionConfig?.baseUrl || defaultBaseUrl;
    this.realmName = connectionConfig?.realmName || defaultRealm;
    this.requestOptions = connectionConfig?.requestOptions;
    this.globalRequestArgOptions = connectionConfig?.requestArgOptions;

    this.roles = new Roles(this);
    this.users = new Users(this);
  }

  public async auth(credentials: Credentials) {
    const { access_token, refresh_token } = await getToken({
      baseUrl: this.baseUrl,
      realmName: this.realmName,
      credentials,
      requestOptions: this.requestOptions,
    });
    this.accessToken = access_token;
    this.refreshToken = refresh_token;

    console.log('###### access token: ', this.accessToken);
  }

  public getRequestOptions() {
    return this.requestOptions;
  }

  public async getAccessToken() {
    return this.accessToken;
  }

  public getGlobalRequestArgOptions():
    | Pick<RequestArgs, "catchNotFound">
    | undefined {
    return this.globalRequestArgOptions;
  }

  public setConfig(connectionConfig: ConnectionConfig) {
    if (
      typeof connectionConfig.baseUrl === "string" &&
      connectionConfig.baseUrl
    ) {
      this.baseUrl = connectionConfig.baseUrl;
    }

    if (
      typeof connectionConfig.realmName === "string" &&
      connectionConfig.realmName
    ) {
      this.realmName = connectionConfig.realmName;
    }
    this.requestOptions = connectionConfig.requestOptions;
  }
}