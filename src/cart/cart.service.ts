import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepo } from 'src/DB/Repo/cart.repo';
import { ProductRepo } from 'src/DB/Repo/product.repo';
import { UserRepo } from 'src/DB/Repo/user.repo';

@Injectable()
export class CartService {
    constructor(private readonly userRepo:UserRepo,
        private readonly productRepo:ProductRepo,
        private readonly cartRepo:CartRepo
    ){}


    async addToCart({
        userId,
        productData
    }:{
        userId:Types.ObjectId,
        productData:{
            productId:Types.ObjectId,
            quantity:number
        }
    }){
        const product=await this.productRepo.findOne({
           filter:{
            _id:productData.productId,
            stock:{
                $gte:productData.quantity
            }
           }
        })
        if(!product){
            throw new BadRequestException('product not found or stock not enough')
        }
        let userCart=await this.cartRepo.findOne({
            filter:{
                userId:userId
            }
        })
        if(!userCart){
            userCart=await this.cartRepo.create({
                data:{
                    userId,
                    items:[{
                        product:product._id,
                        quantity:productData.quantity
                    }]
                }
            })
        }else{
            const productIndex=userCart.items.findIndex(item=>{
                return item.product.toString()==productData.productId.toString()
            })
            if(productIndex==-1){
                userCart.items.push({
                    product:product._id,
                    quantity:productData.quantity
                })
            }
            else{
                const item=userCart.items[productIndex]
                const totalQuantity=item.quantity+productData.quantity
                if(totalQuantity>product.stock){
                    userCart.items[productIndex].quantity=product.stock
                    await userCart.save()
                    throw new BadRequestException(`available stock is ${product.stock} we add a`)
                }
                else {
                    userCart.items[productIndex].quantity=totalQuantity
                }
            }
            await userCart.save()
        }
        return userCart
    }
}
