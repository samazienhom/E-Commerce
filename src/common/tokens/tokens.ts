import { Injectable } from "@nestjs/common";
import { JwtService as JWT, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";

 

@Injectable()
 export class JWTService{
    constructor(private readonly jwtService:JWT){

    }
    sign({payload,options}:{
        payload:any,options?:JwtSignOptions
    }){
        const token=this.jwtService.sign(payload,options || {})
        return token
    }
    verify({token,options}:{token:string,options:JwtVerifyOptions}){
        const result=this.jwtService.verify(token,options)
        return result
    }

 }