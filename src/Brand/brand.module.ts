import { Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { JwtService  as JWT} from "@nestjs/jwt";
import { JWTService } from "src/common/tokens/tokens";
import { UserRepo } from "src/DB/Repo/user.repo";
import { BrandModel } from "src/DB/models/brand.model";
import { UserModel } from "src/DB/models/user.model";
import { BrandRepo } from "src/DB/Repo/brand.repo";



@Module({
    imports:[
        BrandModel,UserModel
    ],
    providers:[BrandService,JWTService,JWT,UserRepo,BrandRepo],
    controllers:[BrandController]
})

export class BrandModule{

}