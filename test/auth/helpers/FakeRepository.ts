import Constants from "../../../constants";
import BcryptPasswordService from "../../../src/auth/data/services/BcryptPasswordService";
import IAuthRepository from "../../../src/auth/domain/IAuthRepository";
import User from "../../../src/auth/domain/User";

export default class FakeRepository implements IAuthRepository {

    public users = [
        {
            email: 'hai@gmail.com',
            id: '112',
            name: 'Ken',
            password: 'abddcd',
            type: 'email',

        },
        {
            email: 'haidd@gmail.com',
            id: '11222',
            name: 'Keeeen',
            password: '',
            type: 'google',

        },
        {
        email: 'h@gmail.com',
        name: 'Abc',
        password:'def',
        type: 'google',
        id:'2'
        }
    ]

    public async find(email: string):Promise<User>{
        console.log('fake repo ki email jo find krni hai',email)
        const user = this.users.find((x)=> {
            console.log("X madarchod: ", x.email);
            console.log("Email madarchod: ", email);
            return x.email === email
        })

        console.log('Major Madarchod',user)

        if(!user){     
        throw new Error(new Constants().userNotFound)
        }

        return new User(user.id,user.name,user.email,user.password,user.type)

        }

        public async add(
            name: string,
            email: string,
            password: string,
            type: string
        ) : Promise<string>{
            const max = 9999
            const min = 1000
            const id = (Math.floor(Math.random() * (+max - +min)) + +min).toString()
            const bcrypt = new BcryptPasswordService();
            const haedPass = await bcrypt.hash(password)
            this.users.push({
                email:email,
                id: id,
                name: name,
                password: haedPass,
                type: type

            })

            console.log("all users in the fake repo----------", this.users);

            return id;
        }
    
} 