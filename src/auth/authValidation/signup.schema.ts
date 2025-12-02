import z from 'zod'
import { GenderEnum } from '../../DB/models/user.model'

export const signupSchema=z.object({
    email:z.email(),
    name:z.string(),
    password:z.string(),
    confirmPass:z.string(),
    age:z.number().positive(),
    gender:z.enum(GenderEnum)
}).superRefine((args,ctx)=>{
    if(args.password!=args.confirmPass){
        ctx.addIssue({
            code:"custom",
            path:['confirmPass'],
            message:"Password must be equal to confirm pass"
        })
    }
})