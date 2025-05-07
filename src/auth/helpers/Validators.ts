import {body,validationResult} from 'express-validator'
import Constants from '../../../constants'
import { Request,Response,NextFunction } from 'express'
import { asyncHandler } from './AsyncHandler'

export const signUpValidationRules = ()=>{ //validation rules
    const constants = new Constants()
    return [
        body('name',constants.nameRequired).notEmpty(),
        body('email',constants.invalidEmail).notEmpty().isEmail().normalizeEmail(),
        body('type',constants.authTypeRequired).notEmpty(),
        body('password',constants.passwordRequired).notEmpty()
        .if(body('type').equals('email')).isLength({min:5}),
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
