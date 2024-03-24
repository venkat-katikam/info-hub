import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/message.model";

connectMongoDB();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const results = await Chat.findById(id)
      .populate("users", "name email image")
      .populate("groupAdmin", "name email image")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const response = await Message.populate(results, {
      path: "latestMessage.sender",
      select: "name email image",
    });
    return NextResponse.json({ chat: response }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        errorMessage: `Something went wrong, Please try again later`,
      },
      { status: 500 }
    );
  }
}
