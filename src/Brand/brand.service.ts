import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { Brand } from "src/DB/models/brand.model";
import { BrandRepo } from "src/DB/Repo/brand.repo";
import fs from 'fs/promises'

@Injectable()
export class BrandService {
    constructor(
        private readonly brandRepo: BrandRepo
    ) { }

    async createBrand(data: Partial<Brand>) {
        const isBandExist = await this.brandRepo.findOne({
            filter: {
                name: data.name
            }
        })
        if (isBandExist) {
            throw new BadRequestException('This name is already in use')
        }
        const brand = await this.brandRepo.create({
            data
        })
        return brand
    }
    async updateBrand(brandId: Types.ObjectId, createdBy: Types.ObjectId, data: Partial<Brand>) {
        const brand = await this.brandRepo.findOne({
            filter: {
                _id: brandId,
                createdBy: createdBy
            }
        })
        if (!brand) {
            throw new NotFoundException('brand not found')
        }
        if (data.name) {
            if (data.name != brand.name) {
                const isNameExist = await this.brandRepo.findOne({
                    filter: {
                        name: data.name
                    }
                })
                if (isNameExist) {
                    throw new BadRequestException('name is already in use')
                }
                brand.name = data.name
            } else {
                throw new BadRequestException('can not use the same name')
            }
        }
        if(data.image){
            if(brand.image){
                await fs.unlink(brand.image)
            } 
            
            brand.image=data.image
        }
        await brand.save()
        return brand
    }
    async getAllbarnds(){
        const data=await this.brandRepo.find({})
        return data
    }
}