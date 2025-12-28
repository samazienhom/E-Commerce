import { BadRequestException, Injectable } from '@nestjs/common';
import { hydratedCategory } from 'src/DB/models/category.model';
import { CategoryRepo } from 'src/DB/Repo/category.repo';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepo:CategoryRepo){}

    async createCategory(data:Partial<hydratedCategory>){
        const isCategoryExist=await this.categoryRepo.findOne({
            filter:{name:data.name}
        })
        if(isCategoryExist){
            throw new BadRequestException('name already in use')
        }
        const category=await this.categoryRepo.create({
            data:data
        })
        return category
    }

    async getAllCategories(){
        const data=await this.categoryRepo.find({})
        return data

    }
}
