import { BadRequestException, Controller, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard, type authReq } from 'src/common/guards/auth-guard/auth-guard.guard';
import { CouponRepo } from 'src/DB/Repo/coupon.repo';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService,
        private readonly couponRepo: CouponRepo
    ) { }

    @Post('create-order')
    @UseGuards(AuthGuard)
    async createOrder(@Req() req: authReq) {
        const userId = req.user._id
        const coupon = req.body.coupon
        let discount=0
        if(coupon){
            const isCoupon = await this.couponRepo.findOne({
            filter: {
                code: coupon
            }
        })
        if(!isCoupon){
            throw new NotFoundException('invalid coupon')
        }
        if (isCoupon.expireIn < new Date(Date.now()) || isCoupon.maximumUse==isCoupon.totalUses) {
            throw new BadRequestException("coupon expired")
        }
        discount=isCoupon.discount
        isCoupon.totalUses+=1
        await isCoupon.save()
        }
       const data= await this.orderService.createOrder({
            userId,
            address:req.body.address,
            notes:req.body.notes,
            discount,
            paymentMethod:req.body.paymentMethod,
            phoneNumber:req.body.phoneNumber
        })
      return {
        data

      }
    }
}
