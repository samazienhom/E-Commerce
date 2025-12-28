import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"

import { Model, Types } from "mongoose"
import { customAlphabet } from "nanoid"

import { OTP, OTPEnum } from "src/DB/models/otp.model"
import { OtpRepo } from "src/DB/Repo/otp.repo"
import { compareHash, createHash } from "../security/hash"


@Injectable()
export class OTPService {
    constructor( private readonly otpRepo: OtpRepo) { }
    async createOtp  (
        {
            type = OTPEnum.VERIFY_EMAIL,
            userId
        }: {
            type?: OTPEnum,
            userId: Types.ObjectId
        }
    ) {
        const nanoid = customAlphabet("0123456789", 6)
        const otp = nanoid()
        const isOTPExist=await this.otpRepo.findOne({
            filter:{userId,type}
        })
        if(isOTPExist && isOTPExist.expiresIn > new Date(Date.now())){
            throw new BadRequestException('OTP already exist')
        }
        if(!isOTPExist){
            await this.otpRepo.create({
                data:{
                    userId,
                    type,
                    expiresIn:new Date(Date.now() + 20* 60 * 1000),
                    otp:await createHash(otp)
                }
            })
            return otp
        }
        else{
            isOTPExist.otp=await createHash(otp)
            isOTPExist.expiresIn=new Date(Date.now()+ 20 * 60 * 1000)
            isOTPExist.save()
            return otp
        }
    }

    async validateOtp(
        { otp, userId, type }:
        { otp: string, userId: Types.ObjectId, type: OTPEnum }) {
            const userOtp=await this.otpRepo.findOne({
                filter:{
                    userId,
                    type
                }
            })
            if(!userOtp){
                throw new NotFoundException('otp not found')
            }
            if(userOtp.expiresIn< new Date(Date.now())){
                throw new BadRequestException('otp expired')
            }
            if(! await compareHash(otp,userOtp.otp)){
                throw new BadRequestException('otp expired')
            }
            await userOtp.deleteOne()
       
    }
}