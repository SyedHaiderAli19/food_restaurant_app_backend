import { error } from "console";
import ITokenStore from "../../services/ITokenStore";
import { RedisClientType } from "redis";
import {promisify} from 'util'

export default class RedisTokenStore implements ITokenStore{
    constructor(private readonly client: RedisClientType){}

    save(token: string): void {
        this.client.set(token,token)
    }
    async get(token: string): Promise<string> {
        const getAsync = promisify(this.client.get).bind(this.client)
        const res = await getAsync(token) as string

        return res ?? ''
    }

}