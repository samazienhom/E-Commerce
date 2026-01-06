import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";

@Injectable()
export class SuccessHandlerInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const start=Date.now()

        return next.handle().pipe(
            tap(()=>{
    
                
            }),
            map((res)=>{
                const{ data={}, msg='success', status=200}=res
                return {
                    msg,
                    status,
                    data
                }
                
            })

        )
    }

}