import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponRepo } from 'src/DB/Repo/coupon.repo';

@Injectable()
export class CouponService {
    constructor(private readonly couponRepo:CouponRepo){}

    async createCoupon(data:{
        code:string,
        maximumUses:number,
        expireIn:Date,
        discount:number
    }){
        const isCoupon=await this.couponRepo.findOne({
            filter:{
                code:data.code
            }
        })
        if(isCoupon){
            throw new BadRequestException('couppon already exist')
        }
        const coupon=await this.couponRepo.create({
            data
        })
        return coupon

    }
}
