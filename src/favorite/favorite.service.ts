import { Injectable, NotFoundException } from '@nestjs/common';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/DB/models/user.model';
import { ProductRepo } from 'src/DB/Repo/product.repo';
import { UserRepo } from 'src/DB/Repo/user.repo';

@Injectable()
export class FavoriteService {
    constructor(private readonly userRepo:UserRepo,
        private readonly productRepo:ProductRepo
    ){}

    async favoriteToggle({
        productId,
        user
    }:{
        productId:Types.ObjectId,
        user:HydratedDocument<User>
    }){
        const product=await this.productRepo.findById({id:productId})
        if(!product){
            throw new NotFoundException('product not found')
        }
      const index=user.favorites.findIndex(prod=>{
        return prod._id.toString()==productId.toString()
      })

      if(index==-1){
        user.favorites.push(productId)
        await user.save()
        return {
            message:"Product added successfully"
        }
      }else{
        user.favorites.splice(index,1)
        await user.save()
        return {
            message:"Product removed successfully"
        }
      }
    }

    
}
