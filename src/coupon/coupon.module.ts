import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponModel } from 'src/DB/models/coupon.model';
import { CouponRepo } from 'src/DB/Repo/coupon.repo';

@Module({
  imports:[CouponModel],
  controllers: [CouponController],
  providers: [CouponService,CouponRepo]
})
export class CouponModule {}
