import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentService } from 'src/common/services/payment/payment.service';
import { OrderStatusEnum, PaymentMethodEnum } from 'src/DB/models/order.model';
import { Product } from 'src/DB/models/product.model';
import { User } from 'src/DB/models/user.model';
import { CartRepo } from 'src/DB/Repo/cart.repo';
import { OrderRepo } from 'src/DB/Repo/order.repo';
import { ProductRepo } from 'src/DB/Repo/product.repo';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
    constructor(private readonly orderRepo: OrderRepo,
        private readonly cartRepo: CartRepo,
        private readonly productRepo: ProductRepo,
        private readonly paymnetServices: PaymentService
    ) {
    }

    async createOrder({
        userId,
        discount,
        notes,
        address,
        paymentMethod,
        phoneNumber
    }: {
        userId: Types.ObjectId,
        discount: number,
        notes: string[],
        address: string,
        phoneNumber: string,
        paymentMethod: PaymentMethodEnum,
    }) {
        const cart = await this.cartRepo.findOne({
            filter: {
                userId
            },
            options: {
                populate: [{
                    path: "items.product"
                }]
            }
        }
        )
        if (!cart || cart.items.length == 0) {
            throw new BadRequestException('cart is embty')
        }
        let actualPrice = cart.items.reduce((actualPrice, item) => actualPrice + (item.product as unknown as Product).salePrice * item.quantity, 0)
        let salePrice = actualPrice - ((discount == 0 ? 0 : discount / 100) * actualPrice)
        for (const item of cart.items) {
            await this.productRepo.updateOne({
                filter: {
                    _id: item.product
                },
                update: {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            })
        }
        const order = await this.orderRepo.create({
            data: {
                address,
                discount,
                items: cart.items,
                paymentMethod,
                notes,
                phoneNumber,
                subTotal: actualPrice,
                totalPrice: salePrice,
                userId
            }
        })
        await cart.updateOne({
            items: []
        })
        return order
    }
    async createCheckoutSession(orderId: Types.ObjectId, userId: Types.ObjectId) {
        const order = await this.orderRepo.findOne({
            filter: {
                _id: orderId,
                userId: userId,
                status: OrderStatusEnum.PENDING,
                paymentMethod: PaymentMethodEnum.CARD
            },
            options: {
                populate: [{
                    path: "userId",
                    select: "name"
                }]
            }
        })
        if (!order) {
            throw new NotFoundException('order not found')
        } 
        const amount = order.totalPrice ?? order.subTotal ?? 0
        const line_items = order.items.map(item => ({
            price_data: {
                currency: "egp",
                product_data: {
                    name: `Order for ${(order.userId as unknown as User).name}`,
                    description: `payment for order on  address ${order.address}`
                },
                unit_amount: amount * 100,
            },
             quantity: item.quantity
        })
        )
        let discounts:Stripe.Checkout.SessionCreateParams.Discount[]=[]
        if(order.discount){
            const coupon=await this.paymnetServices.createCoupon({
                duration:"once",
                currency:"egp",
                percent_off:order.discount
            })
            discounts.push({coupon:coupon.id})
        }
        const session = await this.paymnetServices.checkoutSession({
            customer_email: (order.userId as unknown as User).email,
            line_items,
            mode: "payment",
            discounts,
            metadata: {
                orderId: orderId.toString()
            }
        })

        const method=await this.paymnetServices.createPaymentMethod({
            type:'card',
            card:{token:process.env.PAYMENT_TOKEN}
        }) 
        const paymentIntent=await this.paymnetServices.createPaymentIntent({
            amount:order.subTotal *100,
            currency:"egp",
            payment_method:method.id,
            payment_method_types:[PaymentMethodEnum.CARD]
        })
        order.intentId=paymentIntent.id
        await order.save()
        await this.paymnetServices.confirmPaymentIntent(paymentIntent.id)
        await this.orderRepo.updateOne({
            filter:{
                _id:orderId
            },
            update:{
                status:OrderStatusEnum.CONFIRMED
            }
        })
        return session
    }
    async createRefund(orderId:Types.ObjectId,userId:Types.ObjectId){
        const order = await this.orderRepo.findOne({
            filter: {
                _id: orderId,
                userId: userId,
                status: OrderStatusEnum.PENDING,
                paymentMethod: PaymentMethodEnum.CARD
            },
        })
        if (!order) {
            throw new NotFoundException('order not found')
        } 
        if(!order.intentId){
            throw new BadRequestException('no payment intent for this order')
        }
        const refund=await this.paymnetServices.createRefund(order.intentId)
        await this.orderRepo.findOneAndUpdate({
            filter:{
                _id:orderId
            },
            update:{
                status:OrderStatusEnum.CANCELLED,
                refundId:refund.id,
                refundAt:new Date(),
                $unset:{
                    intentId:true
                }
            },
            options:{
                returnDocument:"after"
            }
        },)
        return order
    }


}
