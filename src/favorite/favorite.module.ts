import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { UserRepo } from 'src/DB/Repo/user.repo';
import { UserModel } from 'src/DB/models/user.model';
import { ProductModel } from 'src/DB/models/product.model';
import { ProductRepo } from 'src/DB/Repo/product.repo';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWTService } from 'src/common/tokens/tokens';

@Module({
  imports:[UserModel,ProductModel],
  controllers: [FavoriteController],
  providers: [FavoriteService,UserRepo,ProductRepo,JWTService,JWT]
})
export class FavoriteModule {}
