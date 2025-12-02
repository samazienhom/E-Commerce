import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { SignupDTO } from "src/auth/authDTO/signup.dto";

@Injectable()
export class TestPipe implements PipeTransform{
    transform(value: SignupDTO, metadata: ArgumentMetadata) {
       console.log({value:value,metadata:metadata});
       if(value.password!=value.confirmPass){
        throw new Error("PAssword must be same as confirm pass");
       }  
    }
    
}