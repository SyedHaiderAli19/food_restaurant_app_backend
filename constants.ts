export default class Constants{
    public readonly userNotFound: string = 'User not found'  
    public readonly invalidUserNamePassword: string = 'Invalid email or password'
    public readonly invalidToken : string = 'Invalid Token'
    public readonly  userAlreadyExists : string = 'User already exists'
    public readonly throwErrorWhenUserNotFound: string = 'should throw an error when user is not found' 
    public readonly throw404WhenUserNotFound = 'should return 404 when the user is not found'
    public readonly return200AndTokenWhenUserIsFound = 'should return 200 and token when user is found'
    public readonly createUserAndReturnToken = 'should create a user and return a token'
    public readonly nameRequired = 'Name Required'
    public readonly invalidEmail = 'Invalid Email'
    public readonly passwordRequired = 'Password Required (Min 5 characters)'
    public readonly authTypeRequired = 'Auth Type Required'
}