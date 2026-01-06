import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderModel } from 'src/DB/models/order.model';
import { OrderRepo } from 'src/DB/Repo/order.repo';
import { CartModel } from 'src/DB/models/cart.model';
import { UserModel } from 'src/DB/models/user.model';
import { UserRepo } from 'src/DB/Repo/user.repo';
import { CartRepo } from 'src/DB/Repo/cart.repo';
import { JWTService } from 'src/common/tokens/tokens';
import { JwtService as JWT} from '@nestjs/jwt';
import { ProductRepo } from 'src/DB/Repo/product.repo';
import { ProductModel } from 'src/DB/models/product.model';
import { CouponRepo } from 'src/DB/Repo/coupon.repo';
import { CouponModel } from 'src/DB/models/coupon.model';
import { PaymentService } from 'src/common/services/payment/payment.service';

@Module({
  imports:[OrderModel,CartModel,UserModel,ProductModel,CouponModel],
  providers: [OrderService,OrderRepo,UserRepo,CartRepo,JWTService,JWT,ProductRepo,CouponRepo,PaymentService],
  controllers: [OrderController]
})
export class OrderModule {}
