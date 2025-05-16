import ITokenStore from "../../services/ITokenStore";
import { RedisClientType } from "redis";

export default class RedisTokenStore implements ITokenStore {
  constructor(private readonly client: RedisClientType) {}

  save(token: string): void {
    this.client.set(token, token);
  }
  async get(token: string): Promise<string> {
    const res = await this.client.get(token);
    return res ?? "";
  }
}
