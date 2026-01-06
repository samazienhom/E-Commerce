import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common"
import { generate, Observable, of, tap } from "rxjs"
import { type authReq } from "../guards/auth-guard/auth-guard.guard"
import { type RedisClientType } from "redis"

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(@Inject('REDIS_CLIENT') private readonly redis: RedisClientType) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest()
        if (req.method != "GET") {
            return next.handle()
        }
        const key = this.generateKey(req)
        const data = await this.redis.get(key)
        if (data) {
            console.log({data});
            
            console.log("data from cache")
            return of(JSON.parse(data))
        }
        return next
            .handle()
            .pipe(
                tap(async (resData) => {
                    console.log({ resData });
                    const value = typeof resData == 'string' ? resData : JSON.stringify(resData)
                    if (!this.redis.isOpen) {
                        this.redis.connect()
                    }
                    await this.redis.set(key, value, {
                        expiration: {
                            type: "EX",
                            value: 20
                        }
                    })
                    console.log("data saved to cache");


                })
            )


    }
    generateKey(req: authReq) {
        const path = req.path
        const query = Object.keys(req.query || {}).length ? `?${JSON.stringify(req.query)}` : ""
        const user = req.user?._id ? `:u${req.user?._id}` : ""
        const Key = `http-cache:${req.method}:${path}${query}${user}`
        console.log(Key);
        return Key

    }

}


