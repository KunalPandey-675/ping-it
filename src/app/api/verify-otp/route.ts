import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { success } from "zod";


export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                }, { status: 500 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExp = new Date(user.verifyCodeExp) > new Date()

        if(isCodeValid && isCodeNotExp){
            user.isVerified = true
            await user.save()
              return Response.json(
            {
                success: true,
                message: " Account Verified Successfully"
            }, { status: 200 }
        )
        }else if( !isCodeNotExp){
              return Response.json(
            {
                success: false,
                message: "verification Code Expired, sign up again"
            }, { status: 400 }
        )
        }
        else{
              return Response.json(
            {
                success: false,
                message: "Verification Code is Incorrect"
            }, { status: 400 }
        )
        }
    } catch (error) {
        console.error("error verifying user", error)
        return Response.json(
            {
                success: false,
                message: " Error verifying user"
            }, { status: 500 }
        )
    }
}