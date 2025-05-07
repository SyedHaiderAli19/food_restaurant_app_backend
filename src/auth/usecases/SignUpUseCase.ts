import Constants from "../../../constants";
import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignUpUseCase {
    constructor(private authRepository: IAuthRepository, private passwordService: IPasswordService){}

    public async execute(
        name: string,
        password:string,
        authType: string,
        email: string,
    ):Promise<string>{
        const user = await this.authRepository.find(email).catch((_)=>null) //if user exists the user id is returned else null is returned via the catch 
        if(user){
            return Promise.reject(new Constants().userAlreadyExists) //Incase of that user already existing in the repo, we don't want the same user again as it already exists
        }

        const userId = await this.authRepository.add( // if not then add the user details to the repo
            name,
            email,
            await this.passwordService.hash(password),
            authType
        )

        return userId; // return the user id from the add method
        
    }
}