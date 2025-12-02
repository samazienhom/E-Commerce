import { registerAs } from "@nestjs/config";


export default registerAs('googleOauth',()=>({
    clientid:process.env.GOOGLE_CLIENT_ID as string,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL:process.env.GOOGLE_URL as string
}))