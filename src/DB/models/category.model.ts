import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model";


@Schema({
    timestamps:true
})
export class Category{

    @Prop({
        type:String,
        required:true,
        unique:true,
        set:function(value:string){
            this.set({
                slug:slugify(value,{
                    lower:true
                })
            })
            return value
        }
    })
    name:string

    @Prop({
        type:String,
        required:true,
        unique:true
    })
    slug:string

    @Prop({
        type:String
    })
    image:string

    @Prop({
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User.name
    })
    createdBy:Types.ObjectId
}
export type hydratedCategory=HydratedDocument<Category>
const CategorySchema= SchemaFactory.createForClass(Category)
export const CategoryModel=MongooseModule.forFeature([
   { 
    name:Category.name,
    schema:CategorySchema
}
])