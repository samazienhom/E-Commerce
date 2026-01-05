import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';

@Controller('coupon')
export class CouponController {
    constructor(private readonly couponService:CouponService){}


    @Post('create-coupon')
    async createCoupon(@Body() body){
        const data = await this.couponService.createCoupon(body)
        return {data}
    }
}
