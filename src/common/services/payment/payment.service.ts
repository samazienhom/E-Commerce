import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe'

@Injectable()
export class PaymentService {

    private stripe:Stripe
    constructor(){
        this.stripe=new Stripe(process.env.STRIPE_SECRET as string)
    }

    async checkoutSession({
        success_url=process.env.SUCCESS_URL as string,
        mode="payment",
        cancel_url=process.env.CANCEL_URL as string,
        discounts=[],
        line_items,
        metadata={},
        customer_email

    }:Stripe.Checkout.SessionCreateParams){
        const session=await this.stripe.checkout.sessions.create({
            success_url,
            line_items,
            mode,
            cancel_url,
            discounts,
            metadata,
            customer_email
        })
        return session
    }

    async createCoupon(data:Stripe.CouponCreateParams){
        const coupon=await this.stripe.coupons.create(data)
        return coupon
    }
    
    async createPaymentMethod(data:Stripe.PaymentMethodCreateParams){
        const paymentMethod=await this.stripe.paymentMethods.create(data)
        console.log(paymentMethod);
        return paymentMethod
    }
    async createPaymentIntent(data:Stripe.PaymentIntentCreateParams){
        const paymentIntent=await this.stripe.paymentIntents.create(data)
        console.log(paymentIntent);
        return paymentIntent
    }
    async retrievePaymentIntent(id:string){
        const intent=await this.stripe.paymentIntents.retrieve(id)
        return intent

    }
    async confirmPaymentIntent(id:string){
        const intentId=await this.retrievePaymentIntent(id)
        if(!intentId){
            throw new BadRequestException('ivalid payment id')
        }
        const confirmPaymentIntent=await this.stripe.paymentIntents.confirm(id)
        console.log(confirmPaymentIntent);
        return confirmPaymentIntent
    }
      async createRefund(id:string){
        const intentId=await this.retrievePaymentIntent(id)
        if(!intentId){
            throw new BadRequestException('ivalid payment id')
        }
        const refund=await this.stripe.refunds.create({
            payment_intent:id
        })
        return refund
    }
}
