import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductModel } from 'src/DB/models/product.model';
import { BrandModel } from 'src/DB/models/brand.model';
import { UserModel } from 'src/DB/models/user.model';
import { CategoryModel } from 'src/DB/models/category.model';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWTService } from 'src/common/tokens/tokens';
import { UserRepo } from 'src/DB/Repo/user.repo';
import { BrandRepo } from 'src/DB/Repo/brand.repo';
import { CategoryRepo } from 'src/DB/Repo/category.repo';
import { ProductRepo } from 'src/DB/Repo/product.repo';
import { createClient } from 'redis';

@Module({
    imports:[
        ProductModel,
        BrandModel,UserModel,
        CategoryModel
    ],
  controllers: [ProductController],
  providers: [ProductService,JWTService,JWT,UserRepo,BrandRepo,CategoryRepo,ProductRepo,
    {
      provide:"REDIS_CLIENT",
      useFactory:()=>{
        const client=createClient({
          url:'redis://127.0.0.1:6379'
        })
        client.connect()
        client.on('error',(err)=>{
          console.log("redis connection error=> ",err);
        })
        console.log("redis connected successfully");
        return client
      }
    }
  ]
})
export class ProductModule {}
