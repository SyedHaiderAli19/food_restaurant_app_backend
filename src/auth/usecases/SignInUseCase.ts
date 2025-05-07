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
            
            if (!user) {
                throw new Error(this.constants.userNotFound); 
            }

            const isPasswordValid = await this.passwordService.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error(this.constants.invalidUserNamePassword); 
            }
        
            return user.id;
            
        }
        
}