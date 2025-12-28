import { Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utilis/multer/upload';
import { AuthGuard, type authReq } from 'src/common/guards/auth-guard/auth-guard.guard';
import { hydratedCategory } from 'src/DB/models/category.model';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService:CategoryService){}


    @Post('create-category')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image',{
        storage:storage('category')
    }))
    async createCategory(@Req() req:authReq){
        const data:Partial<hydratedCategory>={
            name:req.body.name,
            image:req.file?.path,
            createdBy:req.user._id
        }
        return {
            data:await this.categoryService.createCategory(data)
        }
    }

    @Get('get-categories')
    async getCategories(){
        return {
            data:await this.categoryService.getAllCategories()
        }
    }

}
