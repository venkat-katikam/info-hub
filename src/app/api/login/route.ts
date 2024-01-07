import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectMongoDB();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    //check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { errorMessage: "User does not exist" },
        { status: 400 }
      );
    }

    //check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { errorMessage: "Invalid password" },
        { status: 400 }
      );
    }

    //create token data
    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          onboarded: user.onboarded,
        },
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { errorMessage: `An error occured while user login ${error.message}` },
      { status: 500 }
    );
  }
}
