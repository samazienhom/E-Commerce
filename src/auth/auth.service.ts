import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/models/user.model";
import { SignupDTO } from "./authDTO/signup.dto";
import { UserRepo } from "../DB/Repo/user.repo";
import { OTPService } from "src/common/utilis/email/createOtp";
import { OTP, OTPEnum } from "src/DB/models/otp.model";
import { EMAIL_EVENTS, emailEmitter } from "src/common/utilis/email/email.events";
import { otp_tamplate } from "src/common/utilis/email/otp.tamplate";
import { OtpRepo } from "src/DB/Repo/otp.repo";
import { compareHash } from "src/common/utilis/security/hash";


@Injectable()
export class AuthServices{
    constructor(
        private readonly userRepo:UserRepo,
        private readonly otpService:OTPService,
        private readonly otpRepo:OtpRepo
    ){ }

    async signup(data:User){
        const {email,password,name,age,gender}=data
       const isEmailExist =await this.userRepo.findByEmail(email)
       if(isEmailExist){
        throw new BadRequestException("email already exist")
       }
       const user=await this.userRepo.create({
        data:{
            email,
            password,
            name,
            gender,
            age,
            isConfirmed:false
        }
       })
         const otp=await this.otpService.createOtp({
            userId:user._id,
            type:OTPEnum.VERIFY_EMAIL
       })
       const html=otp_tamplate({
        otp:otp,
        name:user.name,
        subject:"Verify your email"
       })
       emailEmitter.publish(EMAIL_EVENTS.VERIFY_EMAIL,{to:email,subject:"Verify your email",html})
       return user
    }

    async confirmEmail(data:any){
        const {email,otp}=data
        const isEmailExist=await this.userRepo.findByEmail(email)
        if(!isEmailExist){
            throw new BadRequestException("User not found")
        }
        if(isEmailExist.isConfirmed){
            throw new BadRequestException("User already confirmed")
        }
        const userOtp=await this.otpRepo.findOne({filter:{
            userId:isEmailExist._id
        }})
        console.log(userOtp);
        
        if(!userOtp){
            throw new BadRequestException("signup first")
        }
        const isExpired=userOtp.expiresIn <new Date(Date.now())
        if(isExpired){
            throw new BadRequestException("OTP expired")
        }
        if(!compareHash(otp,userOtp.otp)){
            throw new BadRequestException("In-valid otp")
        }
        await isEmailExist.updateOne({
            isConfirmed:true
        })
    }

    async resendOtp(data:User){
        const {email}=data
        const isEmailExist=await this.userRepo.findByEmail(email)
        if(!isEmailExist){
            throw new BadRequestException("user not found")
        }
        if(isEmailExist.isConfirmed){
            throw new BadRequestException("User already confirmed")
        }
        const userOtp=await this.otpRepo.findOne({filter:{
            userId:isEmailExist._id
        }})
        if(!userOtp){
            throw new BadRequestException("signup first")
        }
        if(userOtp.expiresIn > new Date(Date.now())){
            throw new BadRequestException("use the last otp")
        }
        const otp=await this.otpService.createOtp({
            type:OTPEnum.VERIFY_EMAIL,
            userId:isEmailExist._id
        })
        const html=otp_tamplate({
            otp,
            name:isEmailExist.name,
            subject:"Resend OTP"
        })
        emailEmitter.publish(EMAIL_EVENTS.VERIFY_EMAIL,{to:email,subjec:"Resend OTP",html})
        return userOtp
    }
}