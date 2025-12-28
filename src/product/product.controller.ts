import { Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard, type authReq } from 'src/common/guards/auth-guard/auth-guard.guard';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utilis/multer/upload';


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
}
