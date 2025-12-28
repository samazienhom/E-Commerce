import { Controller, Get, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { AuthGuard, type authReq } from "src/common/guards/auth-guard/auth-guard.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Brand } from "src/DB/models/brand.model";
import { storage } from "src/common/utilis/multer/upload";
import { Types } from "mongoose";


@Controller('brand')
export class BrandController {
    constructor(
        private readonly brandService: BrandService
    ) { }
    @Post('create-brand')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image',{
        storage:storage('.brands')
    }))
    async createBrand(@Req() req:authReq) {
        const data:Partial<Brand>={
            name:req.body.name,
            createdBy:req.user._id,
            image:req.file?.path as string
        }
        const brand=await this.brandService.createBrand(data)
        return {msg:"success",data:brand}
    }
    @Patch('/update-brand/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image',{
         storage:storage('brands')
        }))
    async updateBrand(@Req() req:authReq){
        const brandId=req.params.id as unknown as Types.ObjectId
        const createdBy=req.user._id
        const image=req.file?.path
        const  name=req.body.name
        const data=await this.brandService.updateBrand(brandId,createdBy,{
            name,
            image
        })
        return {data}
    }
       @Get('get-brands')
        async getCategories(){
            return {
                data:await this.brandService.getAllbarnds()
            }
        }

}

