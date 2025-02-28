import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { pinata } from "@/utils/pinataConfig";

export async function GET(request: Request, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const session = await getServerSession(authOptions);
  
  if(!session || !session.user){
    return Response.json(
      {
        success: false,
        message: "User not authenticated"
      },
      {
        status: 401
      }
    );
  }
  
  if (!username) {
    return new Response(JSON.stringify({ success: false, error: "User id not provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  await dbConnect();
  
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    if (!user.transactionsCID || user.transactionsCID.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No transaction data available" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const cid = user.transactionsCID[user.transactionsCID.length - 1];
    const { data, contentType } = await pinata.gateways.get(`${cid}`);

    return new Response(JSON.stringify({ success: true, data: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}