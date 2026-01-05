import { Model } from "mongoose";
import { DBRepo } from "./db.repo";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart} from "../models/cart.model";

@Injectable()
export class CartRepo extends DBRepo<Cart>{
    constructor(@InjectModel(Cart.name) private readonly cartModel:Model<Cart>){
        super(cartModel)
    }
}