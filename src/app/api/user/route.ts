import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { getDataFromToken } from "@/helpers/getUserFromToken";

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json({
      message: "User found",
      userData: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, email, name, bio, image } = await request.json();
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { email: email.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );
    return NextResponse.json({
      message: "User found",
      userData: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
