import { Model } from "mongoose";
import { DBRepo } from "./db.repo";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../models/product.model";

@Injectable()
export class ProductRepo extends DBRepo<Product>{
    constructor(@InjectModel(Product.name) private readonly productModel:Model<Product>){
        super(productModel)
    }
}