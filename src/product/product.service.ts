import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type RedisClientType } from 'redis';
import { HProduct } from 'src/DB/models/product.model';
import { BrandRepo } from 'src/DB/Repo/brand.repo';
import { CategoryRepo } from 'src/DB/Repo/category.repo';
import { ProductRepo } from 'src/DB/Repo/product.repo';
@Injectable()
export class ProductService {
    constructor(
        private readonly productRepo:ProductRepo,
        private readonly brandRepo:BrandRepo,
        private readonly categoryRepo:CategoryRepo,
        @Inject('REDIS_CLIENT') private readonly redis:RedisClientType
    ){}

    async createProduct(data:Partial<HProduct>){
        const isExist=await this.productRepo.findOne({
            filter:{
                name:data.name
            }
        })
        if(isExist){
            isExist.stock =Number(data.stock)+ Number(isExist.stock)
            await isExist.save()
            return isExist
        }
        // const category=await this.categoryRepo.findById({
        //     id:data.category
        // })
        // const brand=await this.brandRepo.findById({
        //     id:data.brand
        // })
        const [category,brand]=await Promise.all([
            this.categoryRepo.findById({
            id:data.category
        }),
        await this.brandRepo.findById({
            id:data.brand
        })
        ])
        if(!category ){
            throw new NotFoundException('category not found')
        }
        if(!brand){
             throw new NotFoundException('brand not found')
        }
        return {
            data:await this.productRepo.create({
                data
            })
        }
    }
    async getAllProducts(){
        const data=this.productRepo.find({options:{
            populate:[
                {
                    path:'createdBy',
                    select:'name'
                },
                {
                    path:'brand',
                    select:'name image'
                },
                {
                    path:'category',
                    select:'name image'
                }
            ]
        }})
        return data
    }
    async GetAllProductsWithRedis(){
        console.log(0);
        
        const data=await this.productRepo.find({})
        return {
            data:data
        }
    }
}
