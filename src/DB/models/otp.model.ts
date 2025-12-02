import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";


export enum OTPEnum{
    VERIFY_EMAIL='verifyEmail',
    RESET_PASS='resetPass'
}
@Schema({
    timestamps:true
})
export class OTP{
    @Prop({
        type:Types.ObjectId,
        required:true,
        ref:User.name
    })
    userId:Types.ObjectId

    @Prop({
        type:String,
        required:true
    })
    otp:string

    @Prop({
        type:String,
        required:true,
        enum:Object.values(OTPEnum)
    })
    type:OTPEnum

    @Prop({
        type:Date,
        required:true
    })
    expiresIn:Date
    // @Prop({
    //     type:Number,
    //     required:true,
    //     default:3
    // })
    // countdown:number
}

export type OTPDocumnet=HydratedDocument<OTP>
export const OTPSchema=SchemaFactory.createForClass(OTP)
OTPSchema.index(
    {
    userId:1,
    type:1,
},{
    unique:true,
    // expires:1000 * 60 * 15,
    // expireAfterSeconds:0
}
)

export const OTPModel=MongooseModule.forFeature([{
    name:OTP.name,
    schema:OTPSchema
}])