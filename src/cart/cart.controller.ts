import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard, type authReq } from 'src/common/guards/auth-guard/auth-guard.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService:CartService){}

    @Post('add-to-cart')
    @UseGuards(AuthGuard)
    async addToCart(@Req() req:authReq){
        const user=req.user
        const productData=req.body
        return{data:await this.cartService.addToCart({userId:user._id,productData}) }
    }
    
}
