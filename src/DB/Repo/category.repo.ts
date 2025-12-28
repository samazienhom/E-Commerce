import { Model } from "mongoose";
import { DBRepo } from "./db.repo";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "../models/category.model";

@Injectable()
export class CategoryRepo extends DBRepo<Category>{
    constructor(@InjectModel(Category.name) private readonly categoryModel:Model<Category>){
        super(categoryModel)
    }
}