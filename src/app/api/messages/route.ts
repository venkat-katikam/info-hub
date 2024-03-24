import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectMongoDB } from "@/dbConfig/dbConfig";
import Message from "@/models/message.model";
import Chat from "@/models/chat.model";

connectMongoDB();

export async function POST(request: NextRequest) {
  const { content, chatId, userId } = await request.json();

  if (!content || !chatId) {
    return NextResponse.json(
      { errorMessage: "Invalid payload passed into request" },
      { status: 400 }
    );
  }

  var newMessage = {
    sender: userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    return NextResponse.json(
      {
        message: "Message sent",
        data: message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 500 });
  }
}
