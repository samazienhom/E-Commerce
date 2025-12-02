import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.service";
import { UserModel } from "src/DB/models/user.model";
import { UserRepo } from "../DB/Repo/user.repo";
import { OtpRepo } from "../DB/Repo/otp.repo";
import { OTPModel } from "../DB/models/otp.model";
import { OTPService } from "src/common/utilis/email/createOtp";


@Module({
    imports:[UserModel,OTPModel],
    controllers:[AuthController],
    providers:[AuthServices,UserRepo,OtpRepo,OTPService]
})
export class AuthModule{ }