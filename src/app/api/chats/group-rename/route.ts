import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

export async function PUT(req: NextRequest) {
  try {
    const { chatId, chatName } = await req.json();

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "name image email")
      .populate("groupAdmin", "name image email");

    if (!updatedChat) {
      return NextResponse.json(
        {
          errorMessage: `Chat not Found`,
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json({ chats: updatedChat }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        errorMessage: `Something went wrong, Please try again later`,
      },
      { status: 500 }
    );
  }
}
