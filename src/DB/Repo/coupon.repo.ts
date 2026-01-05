import { Model } from "mongoose";
import { DBRepo } from "./db.repo";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Coupon } from "../models/coupon.model";

@Injectable()
export class CouponRepo extends DBRepo<Coupon>{
    constructor(@InjectModel(Coupon.name) private readonly couponModel:Model<Coupon>){
        super(couponModel)
    }
}