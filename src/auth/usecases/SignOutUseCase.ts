import Constants from "../../../constants";
import ITokenStore from "../services/ITokenStore";

export default class SignOutUseCase{
    constructor(private readonly tokenStore: ITokenStore){}
    constants = new Constants()

    public async execute(token: string):Promise<string>{
        this.tokenStore.save(token) //blacklist the following token by adding it to the redis token store
        return Promise.resolve(this.constants.signOutSuccess)
    }
}