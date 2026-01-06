import { Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard, type authReq } from 'src/common/guards/auth-guard/auth-guard.guard';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utilis/multer/upload';
import { CacheInterceptor } from 'src/common/interceptors/cache.interceptor';


@Controller('product')
export class ProductController {
    constructor(private readonly productService:ProductService){}

    @Post('create-product')
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('images',10,{
        storage:storage('products')
    }))
    async createProduct(@Req() req:authReq){

        const data={
            ...req.body,
            // ...(req.body as Product),
            createdBy:req.user._id,
            images:(req.files as Express.Multer.File[]).map(file=>file.path)
        }
        const product=await this.productService.createProduct(data)
        return {
            data:product
        }

    }

    @Get('get-all-products')
    async getAllProducts(){
        return {data: await this.productService.getAllProducts()}
    }
    @Get('products-with-redis')
    @UseInterceptors(CacheInterceptor)
    async testRedis(){
        return this.productService.GetAllProductsWithRedis()
    }
}
