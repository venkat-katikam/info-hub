import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectMongoDB } from "@/dbConfig/dbConfig";
import Message from "@/models/message.model";

connectMongoDB();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const messages = await Message.find({ chat: id })
      .populate("sender", "name image email")
      .populate("chat");
    return NextResponse.json(
      {
        message: "Messages found",
        data: messages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 500 });
  }
}
