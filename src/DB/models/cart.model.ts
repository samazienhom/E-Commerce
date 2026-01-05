import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Mongoose, Types } from "mongoose";
import { User } from "./user.model";
import { Product } from "./product.model";

@Schema({
    timestamps: true
})
export class Cart {
    @Prop({
        type: Types.ObjectId,
        unique: true,
        ref: User.name
    })
    userId: Types.ObjectId

    @Prop({
        type: [{
            product: {
                type: Types.ObjectId,
                ref: Product.name,
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
    })
    items: {
        product: Types.ObjectId,
        quantity: number
    }[]
}

const cartSchema = SchemaFactory.createForClass(Cart)
export const CartModel = MongooseModule.forFeature([{
    name: Cart.name,
    schema: cartSchema
}])