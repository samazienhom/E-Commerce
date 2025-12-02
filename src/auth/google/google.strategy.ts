import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleConfig from "../config/google.config";
import type { ConfigType } from "@nestjs/config";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(googleConfig.KEY) private goofleConfiguration:
        ConfigType<typeof googleConfig>) {
        super({
            clientID: goofleConfiguration.clientid,
            clientSecret: goofleConfiguration.clientSecret,
            callbackURL: goofleConfiguration.callbackURL,
            scope: ["email", "profile"]
        })
    }
     async validate(accessToken:string,refreshToken:string,profile:any,done:VerifyCallback) {
         console.log(profile);
     }
}