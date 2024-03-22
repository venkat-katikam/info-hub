import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

export async function PUT(req: NextRequest) {
  try {
    const { chatId, userId } = await req.json();

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "name email image")
      .populate("groupAdmin", "name email image");

    if (!added) {
      return NextResponse.json(
        {
          errorMessage: `Chat not Found`,
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json({ chats: added }, { status: 200 });
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
