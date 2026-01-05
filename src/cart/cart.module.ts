import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel } from 'src/DB/models/cart.model';
import { UserModel } from 'src/DB/models/user.model';
import { ProductModel } from 'src/DB/models/product.model';
import { ProductRepo } from 'src/DB/Repo/product.repo';
import { CartRepo } from 'src/DB/Repo/cart.repo';
import { UserRepo } from 'src/DB/Repo/user.repo';
import { JWTService } from 'src/common/tokens/tokens';
import { JwtService as JWT} from '@nestjs/jwt';

@Module({
  imports:[CartModel,UserModel,ProductModel],
  controllers: [CartController],
  providers: [CartService,ProductRepo,CartRepo,UserRepo,JWTService,JWT]
})
export class CartModule {}
