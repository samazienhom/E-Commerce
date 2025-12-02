import { DBRepo } from "./db.repo";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OTP } from "../models/otp.model";
import { Model } from "mongoose";

@Injectable()
export class OtpRepo extends DBRepo<OTP>{
    constructor(@InjectModel(OTP.name) private readonly otpModel:Model<OTP>){
        super(otpModel)
    }
}