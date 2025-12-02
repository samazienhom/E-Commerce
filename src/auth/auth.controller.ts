import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthServices } from "./auth.service";
import  type{ Request }  from "express";
import { TestPipe } from "src/common/pipes/test.pipes";
import { SignupDTO } from "./authDTO/signup.dto";
import { signupSchema } from "./authValidation/signup.schema";
import { ZodPipes } from "src/common/pipes/zod/zod.pipe";
import { User } from "src/DB/models/user.model";
import { AuthGuard as JwtAuthGuard } from "src/common/guards/auth-guard/auth-guard.guard";
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';



@Controller('/auth')
export class AuthController{
    constructor(private readonly authService:AuthServices){ }
    @Post('signup')
    @UsePipes(new ZodPipes(signupSchema))
    async signup(@Body() data:User){
        return this.authService.signup(data)
    }

    @Patch('confirm-email')
    async confirmEmail(@Body() data:any){
        return this.authService.confirmEmail(data)
    }

    @Patch('resend-otp')
    async resendOtp(@Body() data:User){
        return this.authService.resendOtp(data)
    }

    @Post('login')
    async login(@Body() data:User){
        return this.authService.login(data)
    }

    @Post('forget-pass')
    async forgetPass(@Body() data:User){
        return this.authService.forgetPass(data)
    }

    @Patch('reset-pass')
    async resetPass(@Body() data:any){
        return this.authService.resetPass(data)
    }

    @Get('google/login')
    @Get('google/login')
    @UseGuards(PassportAuthGuard('google'))
    async googleLogin(){
    }

    @Get('google')
    @UseGuards(PassportAuthGuard('google'))
    async googleRedirect(@Req() req: Request){
    }
}