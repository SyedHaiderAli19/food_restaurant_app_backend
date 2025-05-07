import Constants from "../../../constants";
import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignInUseCase{

    constructor(
        private authRepository : IAuthRepository, private passwordService : IPasswordService){

        }

        constants:Constants = new Constants()
        public async execute(email: string, password: string): Promise<string> {
            const user = await this.authRepository.find(email);
            console.log("User in usecase: ", user);
        
            if (!user) {
                throw new Error(this.constants.userNotFound); 
            }
        
            if (password === '') {
                return user.id;
            }

            console.log('pass from param: ', password);
            console.log('pass from user: ', user.password);
        
            const isPasswordValid = await this.passwordService.compare(password, user.password);
            console.log("Is password valid: ", isPasswordValid);
            if (!isPasswordValid) {
                throw new Error(this.constants.invalidUserNamePassword); 
            }
        
            return user.id;
            
        }
        
}