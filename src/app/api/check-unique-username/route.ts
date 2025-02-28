import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(request: Request) {
    await dbConnect();
    try{
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        const existingVerifiedUser = await UserModel.findOne({ username: username, isVerified: true });
        if(existingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Username is available"
            },
            {
                status: 200
            }
        );
    }
    catch(err){
        console.error("Error checking for unique username: ", err);
        return Response.json(
            {
                success: false,
                message: "Error checking for unique username"
            },
            {
                status: 500
            }
        );
    }
}