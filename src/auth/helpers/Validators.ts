import {body,validationResult} from 'express-validator'
import Constants from '../../../constants'
import { Request,Response,NextFunction } from 'express'
import { asyncHandler } from './AsyncHandler'

const constants = new Constants()
export const signUpValidationRules = ()=>{ //validation rules
    return [
        body('name',constants.nameRequired).notEmpty(),
        body('email',constants.invalidEmail).notEmpty().isEmail().normalizeEmail(),
        body('type',constants.authTypeRequired).notEmpty(),
        body('password',constants.passwordRequired).if(body('type').equals('email')).notEmpty().isLength({min:5}),
    ]
}


 export const signInValidationRules = ()=>{
    return [
        body('name',constants.nameRequired).if(body('type').not().equals('email')).notEmpty(), //name required when type is not email
        body('email',constants.invalidEmail).not().isEmpty().isEmail().normalizeEmail(), 
        body('type',constants.authTypeRequired).notEmpty(),
        body('password',constants.passwordRequired).if(body('type').equals('email')).notEmpty().isLength({min: 5}), //password should not be empty if the type is email and also should be of at least 5 characters
    ]
    
 }

export const validate  = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        
    const errors = validationResult(req)  //validates req upon the rules defined above

    if(errors.isEmpty()){
        return next()
    }

    const extractedErrors : any = []
    errors.array({onlyFirstError: true}).map((err)=>extractedErrors.push({['err.param']:err.msg}))

    return res.status(422).json({errors: extractedErrors})

    }
) 
