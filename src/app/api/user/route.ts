import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { getDataFromToken } from "@/helpers/getUserFromToken";
import { connectMongoDB } from "@/dbConfig/dbConfig";

connectMongoDB();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json(
      {
        message: "User found",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, email, name, bio, image } = await request.json();
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { email: email.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    ).select("-password");
    return NextResponse.json(
      {
        message: "User Updated",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 500 });
  }
}
