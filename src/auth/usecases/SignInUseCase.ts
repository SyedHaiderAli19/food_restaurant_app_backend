import Constants from "../../../constants";
import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignInUseCase{
    

    constructor(
        private authRepository : IAuthRepository, private passwordService : IPasswordService){
        }

        constants  = new Constants();
        
        public async execute(email: string, password: string): Promise<string> {
            const user = await this.authRepository.find(email);
            
            if (!user) {
                throw new Error(this.constants.userNotFound); 
            }

            const isPasswordValid = await this.passwordService.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error(this.constants.invalidEmailPassword); 
            }
        
            return user.id;
            
        }

        private async emailLogin(email: string, password: string){
            const user = await this.authRepository.find(email).catch((_)=>null)

            if(!user || !(await this.passwordService.compare(password,user.password))){ //If user not found or the password is not equal
                return Promise.reject(this.constants.invalidEmailPassword)
            }

            return user.id 
        }

        private async oauthLogin(name: string, email: string, type: string){
            const user = await this.authRepository.find(email).catch((_)=> null)

            if(user && user.type === 'email'){ // if user exists in the repo and the user type is email, we don't want them to sign in using google 
                return Promise.reject(this.constants.accountAlreadyExists)
            }

            if(user){ //if user exists then simply return it's id
                return user.id
            }

            const userId = await this.authRepository.add(name,email,type) //incase when the user is trying to sign in with google for the first time add them to the repo
            return userId

        }

        
        
}