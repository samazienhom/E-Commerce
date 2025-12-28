import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException, Options, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { HydratedDocument, Types } from 'mongoose';
import { Observable } from 'rxjs';
import { JWTService } from 'src/common/tokens/tokens';
import { User } from 'src/DB/models/user.model';
import { UserRepo } from 'src/DB/Repo/user.repo';


export interface authReq extends Request{
  user:HydratedDocument<User>
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService:JWTService,
    private readonly userRepo:UserRepo
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request:authReq=context.switchToHttp().getRequest()
    const token=this.extractTokenFromHeader(request)
    if(!token){
      throw new UnauthorizedException()
    } 
    try{
      const payload:{
        _id:Types.ObjectId,
        email:string
      }=this.jwtService.verify(
       { token,
        options:{
          secret:process.env.JWT_SECRET
        }}
      )
      const user=await this.userRepo.findById({
        id:payload._id
      })
      if(!user){
        throw new NotFoundException("user not found")
      }
      if(!user.isConfirmed){
        throw new BadRequestException("email not confirmed")
      }
      request.user=user
      // request['user']=payload
    }catch {
      throw new UnauthorizedException()
    }
    return true;
  }

  private extractTokenFromHeader(request:authReq):string|undefined{
    const [type,token]=request.headers.authorization?.split(' ')??[]
    return type==='Bearer'?token:undefined
  }
}
