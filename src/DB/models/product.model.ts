import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model";
import { Brand } from "./brand.model";
import { Category } from "./category.model";




@Schema({
    timestamps: true
})
export class Product {
    @Prop({
        type: String,
        required: true,
        unique: true,
        set: function (value: string) {
            this.set({
                slug: slugify(value, {
                    lower: true
                })
            })
            return value
        }
    })
    name: string

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    slug: string

    @Prop({
        type:[String],
        required:true
    })
    images:string[]

    @Prop({
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User.name
    })
    createdBy:Types.ObjectId
    @Prop({
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:Brand.name
    })
    brand:Types.ObjectId
    @Prop({
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:Category.name
    })
    category:Types.ObjectId
    

    @Prop({
        type:Number,
        default:0
    })
    discount:number
    
    @Prop({
        type:Number,
        required:true,
        set:function(value:number){
            this.set({
                salePrice:value-(value*(this.discount/100)||0)
            })
            return value
        }
    })
    originalPrice:number

    @Prop({
        type:Number,
        required:true
    })
    salePrice:number

    @Prop({
        type:Number,
        default:0
    })
    stock:number

    @Prop({
        type:String,
        required:true
    })
    description:string

    @Prop({
        type:Number,
        default:0
    })
    soldItems:number
}

export type HProduct=HydratedDocument<Product>
const productSchema=SchemaFactory.createForClass(Product)
export const ProductModel=MongooseModule.forFeature([
    {
        name:Product.name,
        schema:productSchema
    }
])