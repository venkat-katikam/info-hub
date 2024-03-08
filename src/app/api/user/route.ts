import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { getDataFromToken } from "@/helpers/getUserFromToken";
import { connectMongoDB } from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";

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
    const { userId, email, name, bio, image, password } = await request.json();

    let body: {
      email: string;
      name: string;
      bio: string;
      image: string;
      onboarded: boolean;
      password?: string;
    } = {
      email: email.toLowerCase(),
      name,
      bio,
      image,
      onboarded: true,
    };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      body = {
        ...body,
        password: hashedPassword,
      };
    }

    const user = await User.findOneAndUpdate({ _id: userId }, body, {
      upsert: true,
    }).select("-password");
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
