import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BrandRepo } from 'src/DB/Repo/brand.repo';
import { UserRepo } from 'src/DB/Repo/user.repo';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWTService } from 'src/common/tokens/tokens';
import { CategoryModel } from 'src/DB/models/category.model';
import { UserModel } from 'src/DB/models/user.model';
import { BrandModel } from 'src/DB/models/brand.model';
import { CategoryRepo } from 'src/DB/Repo/category.repo';

@Module({
  imports:[
    CategoryModel,UserModel,BrandModel
  ],
  controllers: [CategoryController],
  providers: [CategoryService,JWTService,JWT,UserRepo,BrandRepo,CategoryRepo]
})
export class CategoryModule {}
