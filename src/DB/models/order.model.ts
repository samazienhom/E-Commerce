import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "./user.model";
import { Product } from "./product.model";


export enum PaymentMethodEnum{
    CARD="card",
    CASH="cash"
}

export enum OrderStatusEnum{
    PENDING="pending",
    CONFIRMED="confirmed",
    SHIPPING="shipping",
    DELIVERE="deliverd",
    CANCELLED ="cancelled"  
}

@Schema({
    timestamps:true
})
export class Order {
    @Prop({
        type:Types.ObjectId,
        ref:User.name,
        required:true
    })
    userId:Types.ObjectId
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

        @Prop({
            type:Number,
            required:true,
        })
        salePrice:number

        @Prop({
            type:Number,
            required:true
        })
        actualPrice:number
        @Prop({
            type:Number,
            default:0
        })
        discount:number

        @Prop({
            type:String,
            required:true
        })
        address:string
        @Prop({
            type:[String],
            default:""
        })
        notes:string[]

        @Prop({
            type:String,
            required:true
        })
        phoneNumber:string

        @Prop({
            type:String,
            enum:Object.values(PaymentMethodEnum),
            required:true
        })
        paymentMethod:PaymentMethodEnum

        @Prop({
            type:String,
            enum:Object.values(OrderStatusEnum),
            default:OrderStatusEnum.PENDING
        })
        status:OrderStatusEnum

}

const orderSchema=SchemaFactory.createForClass(Order)
export const OrderModel=MongooseModule.forFeature([{
    name:Order.name,
    schema:orderSchema
}])