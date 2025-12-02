import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { ProductsModule } from './products/products.module';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";



@Module({
    imports: [ConfigModule.forRoot({
        isGlobal:true
    }), MongooseModule.forRoot(process.env.DBURI as string, {
        onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => console.log('connected'));
            connection.on('open', () => console.log('open'));
            connection.on('disconnected', () => console.log('disconnected'));
            connection.on('reconnected', () => console.log('reconnected'));
            connection.on('disconnecting', () => console.log('disconnecting'));[]
        }
    }),
        AuthModule, UserModule, ProductsModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {

}