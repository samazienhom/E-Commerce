import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { Product } from "./product.model";

export enum GenderEnum{
    MALE="male",
    FEMALE="female"
}
@Schema({
    timestamps:true
})
export class User{
    @Prop({
        type:String,
        required:true
    })
    name:string

     @Prop({
        type:String,
        required:true,
        unique:true
    })
    email:string

     @Prop({
        type:String,
        required:true
    })
    password:string

     @Prop({
        type:Number
    })
    age:number
     @Prop({
        type:String,
        required:true,
        default:GenderEnum.MALE,
        enum:Object.values(GenderEnum)
    })
    gender:GenderEnum

    @Prop({
        type:Boolean,
        required:true,
        default:false
    })
    isConfirmed:boolean

    @Prop({
        type:[mongoose.Schema.Types.ObjectId],
        ref:'product'
    })
    favorites:Array<Types.ObjectId>

}

export const userSchema=SchemaFactory.createForClass(User)

export const UserModel=MongooseModule.forFeature([{
    name:User.name,
    schema:userSchema
}])