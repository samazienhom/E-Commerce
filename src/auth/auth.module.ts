import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.service";
import { UserModel } from "src/DB/models/user.model";
import { UserRepo } from "../DB/Repo/user.repo";
import { OtpRepo } from "../DB/Repo/otp.repo";
import { OTPModel } from "../DB/models/otp.model";
import { OTPService } from "src/common/utilis/email/createOtp";
import { JwtModule, JwtService} from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google/google.strategy';
import googleConfig from "./config/google.config";


@Module({
    imports:[ConfigModule.forRoot({
            isGlobal:true
        }),
        ConfigModule.forFeature(googleConfig),UserModel,OTPModel,
        PassportModule.register({ defaultStrategy: 'google' }),
        JwtModule.register({
            global:true,
            secret:process.env.JWT_SECRET,
            signOptions:{expiresIn:'1d'}
        })
    ],
    controllers:[AuthController],
    providers:[AuthServices,UserRepo,OtpRepo,OTPService,GoogleStrategy]
})
export class AuthModule{ 
}