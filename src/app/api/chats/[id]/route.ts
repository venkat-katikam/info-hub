import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/message.model";

connectMongoDB();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: currentUserId } = params;
    const { chatUserId } = await req.json();

    if (!chatUserId || !currentUserId) {
      console.log("UserId param not sent with request");
      return NextResponse.json(
        {
          errorMessage: `UserId param not sent with request`,
        },
        { status: 400 }
      );
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: chatUserId } } },
      ],
    })
      .populate("users", "name email image")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email image",
    });

    if (isChat.length > 0) {
      return NextResponse.json({ chats: isChat[0] }, { status: 200 });
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [currentUserId, chatUserId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "name email image"
        );
        return NextResponse.json({ chats: FullChat }, { status: 200 });
      } catch (error: any) {
        return NextResponse.json(
          {
            errorMessage: `Unable to create chat`,
          },
          { status: 400 }
        );
      }
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const results = await Chat.find({
      users: { $elemMatch: { $eq: id } },
    })
      .populate("users", "name email image")
      .populate("groupAdmin", "name email image")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const response = await Message.populate(results, {
      path: "latestMessage.sender",
      select: "name email image",
    });
    return NextResponse.json({ chats: response }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        errorMessage: `Something went wrong, Please try again later`,
      },
      { status: 500 }
    );
  }
}
