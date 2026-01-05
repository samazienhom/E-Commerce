import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PaymentMethodEnum } from 'src/DB/models/order.model';
import { Product } from 'src/DB/models/product.model';
import { CartRepo } from 'src/DB/Repo/cart.repo';
import { OrderRepo } from 'src/DB/Repo/order.repo';
import { ProductRepo } from 'src/DB/Repo/product.repo';

@Injectable()
export class OrderService {
    constructor(private readonly orderRepo:OrderRepo,
        private readonly cartRepo:CartRepo,
        private readonly productRepo:ProductRepo
    ){
    }

    async createOrder({
        userId,
        discount,
        notes,
        address,
        paymentMethod,
        phoneNumber
    }:{
        userId:Types.ObjectId,
        discount:number,
        notes:string[],
        address:string,
        phoneNumber:string,
        paymentMethod:PaymentMethodEnum,
    }){
        const cart=await this.cartRepo.findOne({
            filter:{
                userId
        },
    options:{
        populate:[{
            path:"items.product"
        }]
    }}
    )
    if(!cart || cart.items.length==0){
        throw new BadRequestException('cart is embty')
    }
    let actualPrice=cart.items.reduce((actualPrice,item)=>actualPrice+(item.product as unknown as Product).salePrice*item.quantity,0)
    let salePrice=actualPrice-((discount==0?0:discount/100)*actualPrice)
    for (const item of cart.items) {
        await this.productRepo.updateOne({
            filter:{
            _id:item.product
            },
            update:{
                $inc:{
                    stock:-item.quantity
                }
            }
        })
    }
    const order=await this.orderRepo.create({
        data:{
            address,
            discount,
            items:cart.items,
            paymentMethod,
            notes,
            phoneNumber,
            actualPrice,
            salePrice,
            userId
        }
    })
    await cart.updateOne({
        items:[]
    })
    return order
    }
}
