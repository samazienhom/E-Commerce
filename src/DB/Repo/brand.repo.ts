import { Model } from "mongoose";
import { DBRepo } from "./db.repo";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Brand, BrandModel } from "../models/brand.model";

@Injectable()
export class BrandRepo extends DBRepo<Brand>{
    constructor(@InjectModel(Brand.name) private readonly brandModel:Model<Brand>){
        super(brandModel)
    }
}