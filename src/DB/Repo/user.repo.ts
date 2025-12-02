import { Model } from "mongoose";
import { User } from "../models/user.model";
import { DBRepo } from "./db.repo";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserRepo extends DBRepo<User>{
    constructor(@InjectModel(User.name) private readonly userModel:Model<User>){
        super(userModel)
    }

    async findByEmail(email:string){
        return await this.findOne({filter:{email}}) 
    }
}