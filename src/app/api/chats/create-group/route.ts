import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import Chat from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

export async function POST(req: NextRequest) {
  try {
    const { groupName, groupUsers, currentUser } = await req.json();

    if (!groupUsers || !groupName) {
      return NextResponse.json(
        {
          errorMessage: `Please fill all fields of the chat group`,
        },
        { status: 400 }
      );
    }

    if (groupUsers.length < 2) {
      return NextResponse.json(
        {
          errorMessage: `More than 2 users are required to form a group chat`,
        },
        { status: 400 }
      );
    }

    groupUsers.push(currentUser);

    const populatedUsers = await User.find({ _id: { $in: groupUsers } })
      .populate("name image email")
      .exec();

    const currentUserDetails = populatedUsers.find(
      (user) => user._id.toString() === currentUser.toString()
    );

    if (!currentUserDetails) {
      return NextResponse.json(
        {
          errorMessage: `Current user details not found`,
        },
        { status: 404 }
      );
    }

    const groupChat = await Chat.create({
      chatName: groupName,
      users: populatedUsers,
      isGroupChat: true,
      groupAdmin: currentUserDetails,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "name image email")
      .populate("groupAdmin", "name image email");

    return NextResponse.json({ chats: fullGroupChat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        errorMessage: `Something went wrong, Please try again later`,
      },
      { status: 500 }
    );
  }
}
