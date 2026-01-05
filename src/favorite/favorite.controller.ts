import { Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard, type authReq } from 'src/common/guards/auth-guard/auth-guard.guard';
import { Types } from 'mongoose';

@Controller('favorite')
export class FavoriteController {
    constructor(private readonly favoriteService:FavoriteService){
    }

    @Patch('favorite-toggle/:productId')
    @UseGuards(AuthGuard)
    async favoriteToggle(@Req() req:authReq){
        const product=req.params.productId as unknown as Types.ObjectId
        return {data:await this.favoriteService.favoriteToggle({
            productId:product,
            user:req.user
        })}
    }
}
