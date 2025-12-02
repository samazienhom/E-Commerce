import { IsEmail, IsInt, IsString, IsStrongPassword, Max, Min } from "class-validator"



export class SignupDTO{

    @IsEmail()
    email:string

    @IsStrongPassword({
       minLength:3,
       minSymbols:1,
       minUppercase:1,
    })
    password:string

     @IsStrongPassword()
    confirmPass:string

    @IsString()
    name:string

    @IsInt()
    @Min(15)
    @Max(50)
    age:string
}